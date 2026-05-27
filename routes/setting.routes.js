const express = require('express');
const settingController = require('../controllers/setting.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

const router = express.Router();

router.get('/:key', settingController.getSettingByKey);
router.put('/:key', authMiddleware, adminMiddleware(['superadmin', 'admin']), settingController.updateSettingByKey);

module.exports = router;
