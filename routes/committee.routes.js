const express = require('express');
const committeeController = require('../controllers/committee.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/', committeeController.getCommittees);
router.get('/:committeeId', committeeController.getCommitteeMemberDetail);

// Protected routes
router.post(
  '/',
  authMiddleware,
  adminMiddleware(['superadmin', 'admin', 'moderator']),
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'bannerPhoto', maxCount: 1 }]),
  committeeController.createCommitteeMember
);
router.put(
  '/:committeeId',
  authMiddleware,
  adminMiddleware(['superadmin', 'admin', 'moderator']),
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'bannerPhoto', maxCount: 1 }]),
  committeeController.updateCommitteeMember
);
router.delete(
  '/:committeeId',
  authMiddleware,
  adminMiddleware(['superadmin', 'admin']),
  committeeController.deleteCommitteeMember
);

module.exports = router;
