require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const joinRequestsRoutes = require('./routes/joinRequests');
const newsRoutes = require('./routes/news');
const adsRoutes = require('./routes/ads');
const schemesRoutes = require('./routes/schemes');
const subscribersRoutes = require('./routes/subscribers');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/join-requests', joinRequestsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/ads', adsRoutes);
app.use('/api/schemes', schemesRoutes);
app.use('/api/subscribers', subscribersRoutes);

const port = process.env.PORT || 4001;
(async () => {
  try {
    await db.ensureSchema();
    app.listen(port, () => {
      console.log('Backend listening on port', port);
    });
  } catch (err) {
    console.error('Failed to initialize database schema', err);
    process.exit(1);
  }
})();
