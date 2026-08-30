const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const localizationService = require('../services/localizationService');

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

// Public: list accepted news
router.get('/public', async (req, res) => {
  try {
    const requestedLang = String(req.query.lang || 'en').toLowerCase();
    const lang = requestedLang === 'hi' ? 'hi' : 'en';

    const r = await db.query(
      "SELECT id, headline, subheading, byline, body, credit, reference_link, category, author_email, location, poster_url, startup_name, product_name, startup_sector, startup_stage, editor_name, editor_designation, editor_affiliation, headline_i18n, subheading_i18n, byline_i18n, body_i18n, credit_i18n, created_at FROM news WHERE status = 'accept' ORDER BY created_at DESC"
    );

    const rows = r.rows
      .map((row) => {
        const localizedRow = { ...row };

        if (lang === 'hi') {
          localizedRow.headline = row.headline_i18n?.hi || row.headline;
          localizedRow.subheading = row.subheading_i18n?.hi || row.subheading;
          localizedRow.byline = row.byline_i18n?.hi || row.byline;
          localizedRow.body = row.body_i18n?.hi || row.body;
          localizedRow.credit = row.credit_i18n?.hi || row.credit;
        }

        delete localizedRow.headline_i18n;
        delete localizedRow.subheading_i18n;
        delete localizedRow.byline_i18n;
        delete localizedRow.body_i18n;
        delete localizedRow.credit_i18n;

        return localizedRow;
      })
      .filter((row) => {
        if (String(row.category || '').toLowerCase() !== 'startups') return true;
        const productName = String(row.product_name || row.headline || '').trim();
        const startupSector = String(row.startup_sector || '').trim();
        const isBlacklistedStartup =
          productName.toLowerCase().includes('cowcare ai') &&
          productName.toLowerCase().includes('smart livestock') &&
          startupSector.toLowerCase().includes('dairy farming') &&
          startupSector.toLowerCase().includes('animal husbandry');
        if (isBlacklistedStartup) return false;
        return (
          productName &&
          startupSector &&
          productName.toLowerCase() !== 'undefined' &&
          productName.toLowerCase() !== 'null' &&
          startupSector.toLowerCase() !== 'undefined' &&
          startupSector.toLowerCase() !== 'null'
        );
      });

    res.json({ rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Candidate: submit news (creates pending news)
router.post('/', async (req, res) => {
  const {
    headline,
    subheading,
    byline,
    body,
    credit,
    reference_link,
    startup_name,
    product_name,
    startup_sector,
    startup_stage,
    editor_name,
    editor_designation,
    editor_affiliation,
    category,
    author_email,
    location,
    poster_url,
  } = req.body;
  if (!headline || !body) return res.status(400).json({ error: 'Missing fields' });
  try {
    const r = await db.query(
      'INSERT INTO news (headline, subheading, byline, body, credit, reference_link, startup_name, product_name, startup_sector, startup_stage, editor_name, editor_designation, editor_affiliation, category, author_email, location, poster_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING id',
      [
        headline,
        subheading,
        byline,
        body,
        credit,
        reference_link,
        startup_name,
        product_name,
        startup_sector,
        startup_stage,
        editor_name,
        editor_designation,
        editor_affiliation,
        category,
        author_email,
        location || 'home-side',
        poster_url || '',
      ]
    );
    res.json({ id: r.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: list all news
router.get('/admin/all', ensureAdmin, async (req, res) => {
  try {
    const r = await db.query('SELECT * FROM news ORDER BY created_at DESC');
    res.json({ rows: r.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: create news directly as accepted
router.post('/admin', ensureAdmin, async (req, res) => {
  const {
    headline,
    subheading,
    byline,
    body,
    credit,
    reference_link,
    startup_name,
    product_name,
    startup_sector,
    startup_stage,
    editor_name,
    editor_designation,
    editor_affiliation,
    category,
    author_email,
    location,
    poster_url,
  } = req.body;
  if (!headline || !body) return res.status(400).json({ error: 'Missing fields' });
  try {
    console.log('\n[DEBUG] POST /api/news/admin executing');
    const localization = await localizationService.buildLocalizedNewsPayload({
      headline,
      subheading,
      byline,
      body,
      credit,
    });
    console.log('[DEBUG] localization object:', JSON.stringify(localization, null, 2));

    const sql =
      'INSERT INTO news (headline, subheading, byline, body, credit, reference_link, startup_name, product_name, startup_sector, startup_stage, editor_name, editor_designation, editor_affiliation, category, author_email, status, location, poster_url, headline_i18n, subheading_i18n, byline_i18n, body_i18n, credit_i18n) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19::jsonb,$20::jsonb,$21::jsonb,$22::jsonb,$23::jsonb) RETURNING id';

    const params = [
      headline,
      subheading,
      byline,
      body,
      credit,
      reference_link,
      startup_name,
      product_name,
      startup_sector,
      startup_stage,
      editor_name,
      editor_designation,
      editor_affiliation,
      category,
      author_email || 'admin',
      'accept',
      location || 'home-side',
      poster_url || '',
      localization.headline_i18n,
      localization.subheading_i18n,
      localization.byline_i18n,
      localization.body_i18n,
      localization.credit_i18n,
    ];

    console.log('[DEBUG] SQL text:', sql);
    console.log('[DEBUG] params array:', JSON.stringify(params, null, 2));

    const r = await db.query(sql, params);

    const insertedId = r.rows[0].id;
    const check = await db.query('SELECT headline_i18n, body_i18n FROM news WHERE id = $1', [
      insertedId,
    ]);
    console.log('[DEBUG] post-insert JSONB check:', JSON.stringify(check.rows[0], null, 2));
    res.json({ id: r.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM news WHERE id = $1', [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: decide (accept/reject) or modify
router.post('/admin/:id/decide', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  const {
    action,
    headline,
    subheading,
    byline,
    body,
    credit,
    reference_link,
    category,
    location,
    poster_url,
  } = req.body;
  req.body;
  console.log(`/admin/${id}/decide called with`, {
    action,
    headline,
    byline,
    body,
    credit,
    category,
    location,
  });
  if (!['accept', 'reject', 'modify'].includes(action))
    return res.status(400).json({ error: 'Invalid action' });
  try {
    if (action === 'reject') {
      await db.query('UPDATE news SET status=$1 WHERE id=$2', ['reject', id]);
      return res.json({ ok: true });
    }

    if (action === 'modify') {
      if (!headline || !body || !category)
        return res.status(400).json({ error: 'Missing updated news fields' });
      await db.query(
        'UPDATE news SET headline=$1, subheading=$2, byline=$3, body=$4, credit=$5, reference_link=$6, category=$7, status=$8, location=$9, poster_url=$10 WHERE id=$11',
        [
          headline,
          subheading,
          byline,
          body,
          credit,
          reference_link,
          category,
          'accept',
          location || 'home-side',
          poster_url || '',
          id,
        ]
      );
      return res.json({ ok: true });
    }

    // On accept, translate approved text and persist the localized JSONB payload.
    if (action === 'accept') {
      const currentRecord = await db.query(
        'SELECT headline, subheading, byline, body, credit FROM news WHERE id = $1',
        [id]
      );
      const currentNews = currentRecord.rows[0] || {};

      const effectiveHeadline = headline ?? currentNews.headline;
      const effectiveSubheading = subheading ?? currentNews.subheading;
      const effectiveByline = byline ?? currentNews.byline;
      const effectiveBody = body ?? currentNews.body;
      const effectiveCredit = credit ?? currentNews.credit;

      const localization = await localizationService.buildLocalizedNewsPayload({
        headline: effectiveHeadline,
        subheading: effectiveSubheading,
        byline: effectiveByline,
        body: effectiveBody,
        credit: effectiveCredit,
      });

      const headlineI18n = localization.headline_i18n;
      const subheadingI18n = localization.subheading_i18n;
      const bylineI18n = localization.byline_i18n;
      const bodyI18n = localization.body_i18n;
      const creditI18n = localization.credit_i18n;

      if (headline || byline || body || credit || reference_link) {
        if (location) {
          await db.query(
            'UPDATE news SET headline=$1, subheading=$2, byline=$3, body=$4, credit=$5, reference_link=$6, category=$7, status=$8, location=$9, poster_url=$10, headline_i18n=$11::jsonb, subheading_i18n=$12::jsonb, byline_i18n=$13::jsonb, body_i18n=$14::jsonb, credit_i18n=$15::jsonb WHERE id=$16',
            [
              headline,
              subheading,
              byline,
              body,
              credit,
              reference_link,
              category,
              action,
              location || 'home-side',
              poster_url || '',
              headlineI18n,
              subheadingI18n,
              bylineI18n,
              bodyI18n,
              creditI18n,
              id,
            ]
          );
        } else {
          await db.query(
            'UPDATE news SET headline=$1, subheading=$2, byline=$3, body=$4, credit=$5, reference_link=$6, category=$7, status=$8, headline_i18n=$9::jsonb, subheading_i18n=$10::jsonb, byline_i18n=$11::jsonb, body_i18n=$12::jsonb, credit_i18n=$13::jsonb WHERE id=$14',
            [
              headline,
              subheading,
              byline,
              body,
              credit,
              reference_link,
              category,
              action,
              headlineI18n,
              subheadingI18n,
              bylineI18n,
              bodyI18n,
              creditI18n,
              id,
            ]
          );
        }
      } else {
        if (location) {
          await db.query(
            'UPDATE news SET status=$1, location=$2, headline_i18n=$3::jsonb, subheading_i18n=$4::jsonb, byline_i18n=$5::jsonb, body_i18n=$6::jsonb, credit_i18n=$7::jsonb WHERE id=$8',
            [
              action,
              location || 'home-side',
              headlineI18n,
              subheadingI18n,
              bylineI18n,
              bodyI18n,
              creditI18n,
              id,
            ]
          );
        } else {
          await db.query(
            'UPDATE news SET status=$1, headline_i18n=$2::jsonb, subheading_i18n=$3::jsonb, byline_i18n=$4::jsonb, body_i18n=$5::jsonb, credit_i18n=$6::jsonb WHERE id=$7',
            [action, headlineI18n, subheadingI18n, bylineI18n, bodyI18n, creditI18n, id]
          );
        }
      }
    }

    // If admin provided updated fields (headline/byline/body/etc), update them.
    if (action !== 'accept' && (headline || byline || body || credit || reference_link)) {
      // If location is provided, include it in the update so placement can change on accept
      if (location) {
        await db.query(
          'UPDATE news SET headline=$1, subheading=$2, byline=$3, body=$4, credit=$5, reference_link=$6, category=$7, status=$8, location=$9, poster_url=$10 WHERE id=$11',
          [
            headline,
            subheading,
            byline,
            body,
            credit,
            reference_link,
            category,
            action,
            location || 'home-side',
            poster_url || '',
            id,
          ]
        );
      } else {
        await db.query(
          'UPDATE news SET headline=$1, subheading=$2, byline=$3, body=$4, credit=$5, reference_link=$6, category=$7, status=$8 WHERE id=$9',
          [headline, subheading, byline, body, credit, reference_link, category, action, id]
        );
      }
    } else if (action !== 'accept') {
      // No fields provided — just update status. If location provided, set it too (useful when accepting)
      if (location) {
        await db.query('UPDATE news SET status=$1, location=$2 WHERE id=$3', [
          action,
          location || 'home-side',
          id,
        ]);
      } else {
        await db.query('UPDATE news SET status=$1 WHERE id=$2', [action, id]);
      }
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
