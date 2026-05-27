const EventRegistration = require('../models/eventRegistration.model');
const Event = require('../models/event.model');
const { sendSuccess, sendError } = require('../utils/response');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) {
      return sendError(res, 'Event not found', 404);
    }

    let userImage = '';
    if (req.file) {
      userImage = await uploadToCloudinary(req.file.path, 'event_registrations');
    } else if (req.body.userImage) {
      userImage = req.body.userImage;
    }

    if (!userImage) {
      return sendError(res, 'Profile photo is required for event registration', 400);
    }

    const registrationData = {
      ...req.body,
      eventId,
      userImage,
    };

    // If digital, mark payment status completed immediately for simulation
    if (registrationData.paymentType === 'digital') {
      registrationData.paymentStatus = 'completed';
    } else {
      registrationData.paymentStatus = 'pending';
    }

    const registration = new EventRegistration(registrationData);
    await registration.save();

    // Increment RSVP count
    event.rsvpCount = (event.rsvpCount || 0) + 1;
    await event.save();

    // Mock Email Confirmation / Ticket dispatch
    console.log(`\n======================================================`);
    console.log(`✉️ [TICKET SENT] Event confirmation ticket sent!`);
    console.log(`   Recipient: ${registration.email}`);
    console.log(`   Event: ${event.title.en} (${event.title.bn})`);
    console.log(`   PSC Batch: ${registration.pscBatch}`);
    console.log(`   Payment Mode: ${registration.paymentType.toUpperCase()}`);
    console.log(`   Status: ${registration.paymentStatus.toUpperCase()}`);
    console.log(`======================================================\n`);

    return sendSuccess(res, 'Event registration successful! Your confirmation ticket has been emailed.', registration, 201);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;
    const list = await EventRegistration.find({ eventId }).sort({ createdAt: -1 });
    return sendSuccess(res, 'Registrations retrieved successfully', list);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const getMyRegistrations = async (req, res) => {
  try {
    const email = req.user.email;
    const list = await EventRegistration.find({ email }).populate('eventId');
    return sendSuccess(res, 'My registrations retrieved successfully', list);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const getAllEventRegistrations = async (req, res) => {
  try {
    const list = await EventRegistration.find().populate('eventId').sort({ createdAt: -1 });
    return sendSuccess(res, 'All event registrations retrieved successfully', list);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { paymentStatus } = req.body;
    
    if (!['pending', 'completed', 'failed'].includes(paymentStatus)) {
      return sendError(res, 'Invalid payment status', 400);
    }

    const reg = await EventRegistration.findByIdAndUpdate(
      registrationId,
      { paymentStatus },
      { new: true }
    );
    if (!reg) {
      return sendError(res, 'Registration not found', 404);
    }

    return sendSuccess(res, 'Payment status updated successfully', reg);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  registerForEvent,
  getEventRegistrations,
  getMyRegistrations,
  getAllEventRegistrations,
  updatePaymentStatus,
};
