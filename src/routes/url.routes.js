// src/routes/urlRoutes.js
const express = require('express');
const router = express.Router();
const {shortenUrl, redirectUrl} = require('../controllers/url.controller.js');
const {trackVisit} = require('../controllers/analytics.controller.js')

router.post('/shorten', shortenUrl);
router.get('/:shortCode', trackVisit, redirectUrl);

module.exports = router;
