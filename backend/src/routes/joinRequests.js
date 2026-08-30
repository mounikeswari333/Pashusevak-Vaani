const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

function ensureAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(parts[1], process.env.JWT_SECRET);
    if (payload.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

router.post('/', async (req, res) => {
  const { full_name, role, email, mobile_number, country, state, district, village, extra } =
    req.body;
  if (!full_name || !role || !email)
    return res.status(400).json({ error: 'Missing required fields' });
  try {
    const { rows } = await db.query(
      'INSERT INTO join_requests (full_name, role, email, extra, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, status',
      [
        full_name,
        role,
        email,
        JSON.stringify({ mobile_number, country, state, district, village, ...extra }),
        'pending',
      ]
    );
    res.json({ id: rows[0].id, status: rows[0].status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(
      'SELECT id, full_name, role, email, status, extra FROM join_requests WHERE id=$1',
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ row: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { full_name, role, mobile_number, country, state, district, village, extra } = req.body;
  try {
    const { rows } = await db.query('SELECT id, email, status FROM join_requests WHERE id=$1', [
      id,
    ]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const current = rows[0];
    const updatedExtra = JSON.stringify({
      mobile_number,
      country,
      state,
      district,
      village,
      ...extra,
    });
    if (current.status === 'accept') {
      const updateWithType = JSON.stringify({
        ...JSON.parse(updatedExtra),
        approval_type: 'profile-update',
      });
      const insert = await db.query(
        'INSERT INTO join_requests (full_name, role, email, extra, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [full_name, role, current.email, updateWithType, 'pending']
      );
      return res.json({ ok: true, id: insert.rows[0].id });
    }
    await db.query(
      'UPDATE join_requests SET full_name=$1, role=$2, extra=$3, status=$4 WHERE id=$5',
      [full_name, role, updatedExtra, 'pending', id]
    );
    res.json({ ok: true, id: Number(id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', ensureAdmin, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, full_name, role, email, status, extra, created_at FROM join_requests ORDER BY created_at DESC'
    );
    res.json({ rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/decide', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  if (!['accept', 'reject'].includes(action))
    return res.status(400).json({ error: 'Invalid action' });
  try {
    await db.query('UPDATE join_requests SET status=$1 WHERE id=$2', [action, id]);
    const { rows } = await db.query(
      'SELECT id, full_name, role, email, status FROM join_requests WHERE id=$1',
      [id]
    );
    res.json({ row: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
