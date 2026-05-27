const express = require('express');
const blogController = require('../controllers/blog.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/', blogController.getBlogs);
router.get('/:slug', blogController.getBlogDetail);

// Protected routes
router.post(
  '/',
  authMiddleware,
  adminMiddleware(['superadmin', 'admin', 'moderator']),
  upload.single('thumbnail'),
  blogController.createBlog
);
router.delete(
  '/:blogId',
  authMiddleware,
  adminMiddleware(['superadmin', 'admin']),
  blogController.deleteBlog
);

module.exports = router;
