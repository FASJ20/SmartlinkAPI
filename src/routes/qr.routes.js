// src/routes/qrRoutes.js
const express = require('express');
const router = express.Router();
const {generateQrCode, getQrByShortCode} = require('../controllers/qr.controller.js');


router.post('/generateQrCode', generateQrCode);
router.get('/getQr/:shortCode', getQrByShortCode);

module.exports = router;
