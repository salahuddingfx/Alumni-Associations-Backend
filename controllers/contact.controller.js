const { sendContactFormEmail } = require('../utils/email');
const { sendSuccess, sendError } = require('../utils/response');

const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Send email to admin
    await sendContactFormEmail({ name, email, subject, message });

    return sendSuccess(res, 'Your message has been successfully sent to the administration.');
  } catch (error) {
    console.error('Contact form submission error:', error);
    return sendError(res, error.message || 'Failed to submit contact form inquiry', 500);
  }
};

module.exports = {
  submitContactForm,
};
