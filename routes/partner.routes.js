const express = require('express');
const partnerController = require('../controllers/partner.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/', partnerController.getPartners);

// Protected routes
router.post(
  '/',
  authMiddleware,
  adminMiddleware(['superadmin', 'admin', 'moderator']),
  upload.single('logo'),
  partnerController.createPartner
);
router.put(
  '/:partnerId',
  authMiddleware,
  adminMiddleware(['superadmin', 'admin', 'moderator']),
  upload.single('logo'),
  partnerController.updatePartner
);
router.delete(
  '/:partnerId',
  authMiddleware,
  adminMiddleware(['superadmin', 'admin']),
  partnerController.deletePartner
);

module.exports = router;
