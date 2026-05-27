const express = require('express');
const donationController = require('../controllers/donation.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

const router = express.Router();

router.get('/stats', donationController.getDonationStats);
router.post('/checkout', donationController.initiateCheckout);

// Protected routes (Admin views history)
router.get('/', authMiddleware, adminMiddleware(['superadmin', 'admin', 'moderator']), donationController.getDonations);

module.exports = router;
