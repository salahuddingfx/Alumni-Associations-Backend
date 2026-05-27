const express = require('express');
const galleryController = require('../controllers/gallery.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/', galleryController.getGallery);

// Protected routes
router.post(
  '/',
  authMiddleware,
  adminMiddleware(['superadmin', 'admin', 'moderator']),
  upload.single('media'),
  galleryController.createGalleryItem
);
router.delete(
  '/:galleryId',
  authMiddleware,
  adminMiddleware(['superadmin', 'admin']),
  galleryController.deleteGalleryItem
);

module.exports = router;
