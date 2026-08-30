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

// Candidate: submit advertisement request with category, headline, body, and banner image
router.post('/', async (req, res) => {
  const { category, headline, heading, subheading, body, image_url, product_link, author_email } =
    req.body;
  if (!category || !headline || !body || !image_url || !author_email)
    return res.status(400).json({ error: 'Missing required advertisement fields' });
  try {
    const columns = [
      'title',
      'heading',
      'subheading',
      'body',
      'image_url',
      'product_link',
      'author_email',
      'status',
    ];
    const values = [
      headline,
      heading || '',
      subheading || '',
      body,
      image_url,
      product_link || '',
      author_email,
      'pending',
    ];

    const hasCategoryColumn = true;
    if (hasCategoryColumn) {
      columns.unshift('category');
      values.unshift(category);
    }

    const placeholders = columns.map((_, idx) => `$${idx + 1}`).join(', ');
    const r = await db.query(
      `INSERT INTO advertisements (${columns.join(', ')}) VALUES (${placeholders}) RETURNING id`,
      values
    );
    res.json({ id: r.rows[0].id });
  } catch (err) {
    console.error('ads insert failed', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.delete('/:id', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM advertisements WHERE id = $1', [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: list all ads with user name
router.get('/admin/all', ensureAdmin, async (req, res) => {
  try {
    const r = await db.query(
      'SELECT a.*, jr.full_name as author_name FROM advertisements a LEFT JOIN join_requests jr ON a.author_email = jr.email ORDER BY a.created_at DESC'
    );
    res.json({ rows: r.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: decide, accept, reject or modify
router.post('/admin/:id/decide', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  const { action, category, headline, heading, subheading, body, image_url, product_link } =
    req.body;
  if (!['accept', 'reject', 'modify'].includes(action))
    return res.status(400).json({ error: 'Invalid action' });
  try {
    if (action === 'reject') {
      await db.query('UPDATE advertisements SET status=$1 WHERE id=$2', ['reject', id]);
      return res.json({ ok: true });
    }

    if (action === 'modify') {
      if (!category || !headline || !body || !image_url)
        return res.status(400).json({ error: 'Missing updated advertisement fields' });
      await db.query(
        'UPDATE advertisements SET category=$1, title=$2, heading=$3, subheading=$4, body=$5, image_url=$6, product_link=$7, status=$8 WHERE id=$9',
        [
          category,
          headline,
          heading || '',
          subheading || '',
          body,
          image_url,
          product_link || '',
          'accept',
          id,
        ]
      );
      return res.json({ ok: true });
    }

    if (action === 'accept') {
      if (category || headline || body || image_url || heading || subheading || product_link) {
        await db.query(
          'UPDATE advertisements SET category=$1, title=$2, heading=$3, subheading=$4, body=$5, image_url=$6, product_link=$7, status=$8 WHERE id=$9',
          [
            category || '',
            headline || '',
            heading || '',
            subheading || '',
            body || '',
            image_url || '',
            product_link || '',
            'accept',
            id,
          ]
        );
      } else {
        await db.query('UPDATE advertisements SET status=$1 WHERE id=$2', ['accept', id]);
      }
      return res.json({ ok: true });
    }

    res.status(400).json({ error: 'Invalid action' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Public: get accepted ads
router.get('/public', async (req, res) => {
  try {
    const r = await db.query(
      "SELECT id, title, heading, subheading, image_url, product_link, author_email, created_at FROM advertisements WHERE status = 'accept' ORDER BY created_at DESC"
    );
    res.json({ rows: r.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
