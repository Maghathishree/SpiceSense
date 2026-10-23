const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'spicesense_secret_key_2026';

// Optional auth: populates req.user if token is present, else marks as guest
const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  // If no token provided, set req.user to guest
  req.user = { id: 'guest', username: 'Guest Chef' };
  return next();
};

// Strict auth: requires a valid JWT token; rejects guests with 401
const requireAuth = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      if (!req.user || !req.user.id || req.user.id === 'guest') {
        return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid or expired token' });
    }
  }

  return res.status(401).json({ success: false, message: 'Not authorized, no token provided. Please log in.' });
};

module.exports = { protect, requireAuth, JWT_SECRET };
