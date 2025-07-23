// src/middlewares/apiKeyAuth.js
const api_key = require('../config/env.config.js')
const apiKeyAuth = (req, res, next) => {
  const userApiKey = req.headers['x-api-key'];
  const serverApiKey = api_key;

  if (!userApiKey || userApiKey !== serverApiKey) {
    return res.status(403).json({ success: false, message: 'Invalid or missing API key' });
  }

  next();
};

module.exports = apiKeyAuth;
