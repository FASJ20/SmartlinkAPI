// src/controllers/analyticsController.js
const Analytics = require('../models/Analytics.model.js');
const Url = require('../models/Url.model.js');
const geoip = require('geoip-lite');

// Save visit analytics when a short URL is accessed
exports.trackVisit = async (req, res, next) => {
  const { params: shortCode} = req;

  try {
    const urlData = await Url.findOne({ shortCode: shortCode.shortCode});
    if (!urlData) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip) || {};
    const location = geo.city ? `${geo.city}, ${geo.country}` : 'Unknown';

    const analyticsData = new Analytics({
      shortCode: urlData.shortCode,
      visitTime: new Date(),
      ipAddress: ip,
      userAgent: req.headers['user-agent'],
      location
    });

    await analyticsData.save();

    req.originalUrlData = urlData; // Forward URL to redirect in next middleware
    next();

  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({ error: 'Error tracking analytics' });
  }
};

// GET /api/analytics/:shortCode - View analytics for a short URL
exports.getAnalyticsByShortCode = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const data = await Analytics.find({ shortCode }).sort({ visitTime: -1 });
    res.json(data);
  } catch (error) {
    console.error('Error retrieving analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

// GET /api/analytics - View all analytics
exports.getAllAnalytics = async (req, res) => {
  try {
    const data = await Analytics.find().sort({ visitTime: -1 });
    res.json(data);
  } catch (error) {
    console.error('Error retrieving all analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};
