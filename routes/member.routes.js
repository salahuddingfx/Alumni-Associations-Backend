const express = require('express');
const memberController = require('../controllers/member.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/', memberController.getMembers);
router.get('/:memberId', memberController.getMemberDetail);
router.post('/', upload.single('profilePhoto'), memberController.createMemberProfile);

// Protected routes (Admin & Moderators approval flow)
router.get(
  '/admin/pending',
  authMiddleware,
  adminMiddleware(['superadmin', 'admin', 'moderator']),
  memberController.getPendingMembers
);
router.put(
  '/:memberId/approve',
  authMiddleware,
  adminMiddleware(['superadmin', 'admin', 'moderator']),
  memberController.approveMember
);
router.delete(
  '/:memberId',
  authMiddleware,
  adminMiddleware(['superadmin', 'admin']),
  memberController.deleteMember
);

module.exports = router;
