const AuditLog = require('../models/auditLog.model');

/**
 * Creates and saves an immutable audit log entry.
 * @param {object} req Express request object to retrieve user and IP info
 * @param {string} action Description of the action performed
 * @param {object} details Dynamic key-value details of the action
 */
const logActivity = async (req, action, details = {}) => {
  try {
    const adminId = req.user ? req.user.id : null;
    if (!adminId) return; // Ignore unauthenticated log requests

    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

    const log = new AuditLog({
      action,
      adminId,
      details,
      ipAddress,
    });

    await log.save();
  } catch (error) {
    console.error('Audit logging execution failed:', error.message);
  }
};

module.exports = { logActivity };
