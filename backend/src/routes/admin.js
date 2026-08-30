const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

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

// For demo purposes, we store join requests in a simple table and return them.
router.get('/join-requests', ensureAdmin, async (req, res) => {
  try {
    const r = await db.query(
      'SELECT id, full_name, role, email, status FROM join_requests ORDER BY id DESC'
    );
    res.json({ rows: r.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/join-requests/:id/decide', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'accept' or 'reject'
  if (!['accept', 'reject'].includes(action)) return res.status(400).json({ error: 'Invalid' });
  try {
    await db.query('UPDATE join_requests SET status = $1 WHERE id = $2', [action, id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/join-requests/:id', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM join_requests WHERE id = $1', [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
