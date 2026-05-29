const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware(['superadmin', 'admin']));

router.get('/', userController.getAllUsers);
router.put('/:userId/approve', userController.approveUser);
router.put('/:userId/role', userController.updateUserRole);
router.delete('/:userId', userController.deleteUser);

module.exports = router;
