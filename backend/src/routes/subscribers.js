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

router.post('/', async (req, res) => {
  const { email, schemes, market, hindi } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  try {
    const r = await db.query(
      'INSERT INTO subscribers (email, schemes, market, hindi) VALUES ($1, $2, $3, $4) RETURNING id, email, schemes, market, hindi, created_at',
      [email.toLowerCase().trim(), !!schemes, !!market, !!hindi]
    );
    res.json({ row: r.rows[0] });
  } catch (err) {
    console.error('subscribers insert failed', err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email already subscribed' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', ensureAdmin, async (req, res) => {
  try {
    const r = await db.query(
      'SELECT id, email, schemes, market, hindi, created_at FROM subscribers ORDER BY created_at DESC'
    );
    res.json({ rows: r.rows });
  } catch (err) {
    console.error('Failed to fetch subscribers', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
