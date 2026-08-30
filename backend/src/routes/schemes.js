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
  const {
    name,
    subheading,
    organisation,
    scheme_type,
    description,
    eligibility,
    deadline,
    benefits,
    apply_link,
    keywords,
    poster_url,
    author_email,
  } = req.body;
  if (!name || !organisation || !description)
    return res.status(400).json({ error: 'Missing required scheme fields' });
  try {
    const { rows } = await db.query(
      'INSERT INTO schemes (name, subheading, organisation, scheme_type, description, eligibility, deadline, benefits, apply_link, keywords, poster_url, author_email, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id',
      [
        name,
        subheading || '',
        organisation,
        scheme_type || 'Central Government Scheme',
        description,
        eligibility || '',
        deadline || '',
        benefits || '',
        apply_link || '',
        keywords || '',
        poster_url || '',
        author_email || '',
        'pending',
      ]
    );
    res.json({ id: rows[0].id });
  } catch (err) {
    console.error('scheme insert failed', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.get('/admin/all', ensureAdmin, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM schemes ORDER BY created_at DESC');
    res.json({ rows });
  } catch (err) {
    console.error('failed to fetch schemes', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/admin/:id/decide', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  if (!['accept', 'reject'].includes(action))
    return res.status(400).json({ error: 'Invalid action' });
  try {
    await db.query('UPDATE schemes SET status = $1 WHERE id = $2', [action, id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('failed to update scheme status', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM schemes WHERE id = $1', [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('failed to delete scheme', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/public', async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT id, name, organisation, scheme_type, description, eligibility, deadline, benefits, apply_link, keywords, poster_url, author_email, created_at FROM schemes WHERE status = 'accept' ORDER BY created_at DESC"
    );
    res.json({ rows });
  } catch (err) {
    console.error('failed to fetch public schemes', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
