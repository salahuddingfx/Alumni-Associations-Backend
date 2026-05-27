const EventRegistration = require('../models/eventRegistration.model');
const Event = require('../models/event.model');
const { sendSuccess, sendError } = require('../utils/response');

const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) {
      return sendError(res, 'Event not found', 404);
    }

    const userImage = req.file ? `/uploads/${req.file.filename}` : '';
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

module.exports = {
  registerForEvent,
  getEventRegistrations,
  getMyRegistrations,
};
