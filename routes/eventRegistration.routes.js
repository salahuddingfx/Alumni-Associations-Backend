const express = require('express');
const eventRegistrationController = require('../controllers/eventRegistration.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

const upload = require('../middlewares/upload.middleware');

const router = express.Router({ mergeParams: true });

// Public route to register for an event (No auth required)
router.post('/register', upload.single('userImage'), eventRegistrationController.registerForEvent);

// Admin-only route to view registrations
router.get(
  '/registrations',
  authMiddleware,
  adminMiddleware(['superadmin', 'admin', 'moderator']),
  eventRegistrationController.getEventRegistrations
);

module.exports = router;
