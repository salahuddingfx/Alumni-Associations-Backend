const express = require('express');
const noticeController = require('../controllers/notice.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/', noticeController.getNotices);
router.get('/:noticeId', noticeController.getNoticeDetail);

// Protected routes
router.post(
  '/',
  authMiddleware,
  adminMiddleware(['superadmin', 'admin', 'moderator']),
  upload.single('file'),
  noticeController.createNotice
);
router.put(
  '/:noticeId',
  authMiddleware,
  adminMiddleware(['superadmin', 'admin', 'moderator']),
  upload.single('file'),
  noticeController.updateNotice
);
router.delete(
  '/:noticeId',
  authMiddleware,
  adminMiddleware(['superadmin', 'admin']),
  noticeController.deleteNotice
);

module.exports = router;
