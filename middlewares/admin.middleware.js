const adminMiddleware = (roles = ['superadmin', 'admin']) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied. Unauthorized role.' });
    }

    next();
  };
};

module.exports = adminMiddleware;
