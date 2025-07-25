// src/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
  });
  next()
};

module.exports = errorHandler;
