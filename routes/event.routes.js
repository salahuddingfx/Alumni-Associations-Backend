const express = require('express');
const eventController = require('../controllers/event.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const upload = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');
const { eventSchema } = require('../validations/event.validation');

const eventRegistrationRoutes = require('./eventRegistration.routes');

const eventRegistrationController = require('../controllers/eventRegistration.controller');

const router = express.Router();

router.use('/:eventId/registration', eventRegistrationRoutes);

router.get(
  '/admin/registrations',
  authMiddleware,
  adminMiddleware(['superadmin', 'admin', 'moderator']),
  eventRegistrationController.getAllEventRegistrations
);

router.put(
  '/admin/registrations/:registrationId/payment-status',
  authMiddleware,
  adminMiddleware(['superadmin', 'admin', 'moderator']),
  eventRegistrationController.updatePaymentStatus
);

router.get('/my/registrations', authMiddleware, eventRegistrationController.getMyRegistrations);
router.get('/', eventController.getEvents);
router.get('/:eventId', eventController.getEventDetail);

// Protected routes (Admins & Moderators)
router.post(
  '/',
  authMiddleware,
  adminMiddleware(['superadmin', 'admin', 'moderator']),
  upload.single('banner'),
  eventController.createEvent
);
router.put(
  '/:eventId',
  authMiddleware,
  adminMiddleware(['superadmin', 'admin', 'moderator']),
  upload.single('banner'),
  eventController.updateEvent
);
router.delete(
  '/:eventId',
  authMiddleware,
  adminMiddleware(['superadmin', 'admin']),
  eventController.deleteEvent
);

module.exports = router;
