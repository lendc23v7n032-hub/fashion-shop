const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Security headers
const securityHeaders = helmet({
  contentSecurityPolicy: false,
});

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()).filter(Boolean)
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

// CORS configuration
const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
  credentials: true,
};
// Rate limiter cho API chung

// Rate limiter cho API chung (production-safe defaults)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // tối đa 100 requests mỗi 15 phút
  message: { success: false, error: 'Quá nhiều yêu cầu, vui lòng thử lại sau' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter cho checkout (nghiêm ngặt hơn)
const checkoutLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 10, // tối đa 10 đơn/phút
  message: { success: false, error: 'Quá nhiều yêu cầu thanh toán, vui lòng thử lại sau' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter cho auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: 'Quá nhiều lần thử, vui lòng thử lại sau 15 phút' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  securityHeaders,
  corsOptions,
  apiLimiter,
  checkoutLimiter,
  authLimiter,
};
