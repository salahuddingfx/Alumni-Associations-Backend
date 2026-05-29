const express = require('express');
const memberController = require('../controllers/member.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

// ── Public routes ──────────────────────────────────────────────
router.get('/', memberController.getMembers);
router.post('/', upload.single('profilePhoto'), memberController.createMemberProfile);

// ── Authenticated user (self) routes ───────────────────────────
// Must come before /:memberId to avoid wildcard capture
router.get('/my/profile', authMiddleware, memberController.getMyProfile);
router.put('/my/profile', authMiddleware, upload.single('profilePhoto'), memberController.updateMyProfile);
router.get('/my/id-card', authMiddleware, memberController.getMyIdCard);
router.get('/my/id-card/pkpass', authMiddleware, memberController.downloadPkpass);

// ── Admin routes ── Must come before /:memberId wildcard ────────
router.get(
  '/admin/pending',
  authMiddleware,
  adminMiddleware(['superadmin', 'admin', 'moderator']),
  memberController.getPendingMembers
);
router.get(
  '/admin/all',
  authMiddleware,
  adminMiddleware(['superadmin', 'admin', 'moderator']),
  memberController.getAllMembersAdmin
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

// ── Dynamic param routes (MUST be last) ────────────────────────
router.get('/:memberId', memberController.getMemberDetail);

module.exports = router;
