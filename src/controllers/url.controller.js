// src/controllers/urlController.js
const { nanoid } = require('nanoid');
const Url = require('../models/Url.model.js');

// POST /api/shorten - Shorten a long URL
exports.shortenUrl = async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: 'Original URL is required' });
  }

  try {
    const shortCode = nanoid(6); // generates a 6-char unique code
    const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;

    const newUrl = new Url({
      originalUrl,
      shortUrl,
      shortCode,
      createdAt: new Date()
    });

    await newUrl.save();
    res.status(201).json(newUrl);

  } catch (error) {
    console.error('Shorten URL Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /:shortCode - Redirect to original URL
exports.redirectUrl = async (req, res) => {
  const { params: shortCode } = req;

  try {
    const urlEntry = await Url.findOneAndUpdate({shortCode: shortCode.shortCode}, { $inc: { clicks: 1 }});
    

    if (!urlEntry) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    console.log(urlEntry)

     

    // Optional: Log analytics here before redirecting
    

    
    res.redirect(urlEntry.originalUrl);

  } catch (error) {
    console.error('Redirect Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
