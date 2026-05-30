const express = require('express');
const contactController = require('../controllers/contact.controller');
const validate = require('../middlewares/validate.middleware');
const { contactSchema } = require('../validations/contact.validation');

const router = express.Router();

router.post('/', validate(contactSchema), contactController.submitContactForm);

module.exports = router;
