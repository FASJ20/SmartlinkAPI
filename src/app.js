// src/app.js
const client = require('prom-client');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const apiKeyAuth = require('./middleware/apiKeyAuth.js');
const errorHandler = require('./middleware/errorHandler.js');
const {dbconnect} = require('./config/db.js')

const urlRoutes = require('./routes/url.routes.js');
const qrRoutes = require('./routes/qr.routes.js');
const analyticsRoutes = require('./routes/analytics.routes.js');
const rateLimit = require('express-rate-limit')

// Load .env variables
dotenv.config();

const app = express();
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 15,
    message: "To many request, please try again after a minute"
})
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// Connect to database
dbconnect()


// Middleware stack
// app.use(limiter)
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

//  Enforce API Key for all routes
 app.use(apiKeyAuth);

// Routes
app.use('/api', urlRoutes);
app.use('/api', qrRoutes);
app.use('/api', analyticsRoutes);

app.get('/', (req, res) => {
    res.send("welcome to the smartlink api to test how dynamic HPA works")
})


app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err.message);
  }
})
// Error handling middleware (should come after routes)
app.use(errorHandler);

module.exports = app;
