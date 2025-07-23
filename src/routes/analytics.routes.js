// src/routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const {getAllAnalytics, getAnalyticsByShortCode, trackVisit}= require('../controllers/analytics.controller.js');

router.get('/analytics', getAllAnalytics);
router.get('/analytics/:shortCode', getAnalyticsByShortCode);

module.exports = router;
