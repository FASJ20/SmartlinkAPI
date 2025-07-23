// src/controllers/qrController.js
const QRCode = require('qrcode');
const Qr = require('../models/Qr.model.js');
const Url = require('../models/Url.model.js');

// POST /api/qr - Generate QR code for a URL
exports.generateQrCode = async (req, res) => {
  const { url, format = 'png' } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required to generate QR code' });
  }

  try {
    const qrImageBuffer = await QRCode.toBuffer(url);

    const newQR = new Qr({
      url,
      qrImage: qrImageBuffer,
      format,
      createdAt: new Date()
    });

    await newQR.save();

    res.set('Content-Type', 'image/png');
    res.send(qrImageBuffer);

  } catch (error) {
    console.error('QR Code Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
};

// GET /api/qr/:shortCode - Get QR code for a shortened URL
exports.getQrByShortCode = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const urlEntry = await Url.findOne({ shortCode });

    if (!urlEntry) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    const qrImageBuffer = await QRCode.toBuffer(urlEntry.shortUrl);

    res.set('Content-Type', 'image/png');
    console.log(qrImageBuffer)
    res.send(qrImageBuffer);

  } catch (error) {
    console.error('QR Retrieval Error:', error);
    res.status(500).json({ error: 'Failed to fetch QR code' });
  }
};
