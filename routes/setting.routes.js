const express = require('express');
const settingController = require('../controllers/setting.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/:key', settingController.getSettingByKey);
router.put('/:key', authMiddleware, adminMiddleware(['superadmin', 'admin']), settingController.updateSettingByKey);
router.post('/upload', authMiddleware, adminMiddleware(['superadmin', 'admin']), upload.single('image'), settingController.uploadMedia);

module.exports = router;
