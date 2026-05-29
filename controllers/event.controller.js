const eventService = require('../services/event.service');
const { sendSuccess, sendError } = require('../utils/response');
const { emitRealtimeEvent } = require('../sockets/notification.socket');

const getEvents = async (req, res) => {
  try {
    const events = await eventService.listEvents();
    return sendSuccess(res, 'Events retrieved successfully', events);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const getEventDetail = async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.eventId);
    if (!event) {
      return sendError(res, 'Event not found', 404);
    }
    return sendSuccess(res, 'Event detail retrieved successfully', event);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const createEvent = async (req, res) => {
  try {
    const banner = req.file ? `/uploads/${req.file.filename}` : '';
    const eventData = {
      ...req.body,
      banner,
    };
    // If nested objects are sent as strings, parse them
    if (typeof eventData.title === 'string') eventData.title = JSON.parse(eventData.title);
    if (typeof eventData.description === 'string') eventData.description = JSON.parse(eventData.description);
    if (typeof eventData.location === 'string') eventData.location = JSON.parse(eventData.location);

    const event = await eventService.createEvent(eventData);

    // Emit live update
    emitRealtimeEvent(event);

    return sendSuccess(res, 'Event created successfully', event, 201);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const updateEvent = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.banner = `/uploads/${req.file.filename}`;
    }
    if (typeof updateData.title === 'string') updateData.title = JSON.parse(updateData.title);
    if (typeof updateData.description === 'string') updateData.description = JSON.parse(updateData.description);
    if (typeof updateData.location === 'string') updateData.location = JSON.parse(updateData.location);

    const event = await eventService.updateEvent(req.params.eventId, updateData);
    if (!event) {
      return sendError(res, 'Event not found', 404);
    }
    return sendSuccess(res, 'Event updated successfully', event);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await eventService.deleteEvent(req.params.eventId);
    if (!event) {
      return sendError(res, 'Event not found', 404);
    }
    return sendSuccess(res, 'Event deleted successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const getEventSeating = async (req, res) => {
  try {
    const EventSeating = require('../models/eventSeating.model');
    const seating = await EventSeating.find({ eventId: req.params.eventId });
    return sendSuccess(res, 'Event seating retrieved successfully', seating);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const bookEventSeat = async (req, res) => {
  try {
    const EventSeating = require('../models/eventSeating.model');
    const Member = require('../models/member.model');
    const { tableNumber, seatNumber } = req.body;
    
    const member = await Member.findOne({ user: req.user.id });
    if (!member) {
      return sendError(res, 'You need an active alumni profile to book a seat.', 400);
    }
    
    const existingBooking = await EventSeating.findOne({ eventId: req.params.eventId, occupiedBy: member._id });
    if (existingBooking) {
      return sendError(res, `You have already booked Table ${existingBooking.tableNumber}, Seat ${existingBooking.seatNumber}.`, 400);
    }
    
    const seat = await EventSeating.findOneAndUpdate(
      { eventId: req.params.eventId, tableNumber, seatNumber },
      { 
        occupiedBy: member._id, 
        occupiedByName: member.name.en, 
        batch: member.batch 
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    
    try {
      const { getIO } = require('../config/socket');
      const io = getIO();
      io.emit('seat_booked', { eventId: req.params.eventId, seat });
    } catch (e) {
      console.log('Socket seat emit error:', e.message);
    }
    
    return sendSuccess(res, 'Seat booked successfully', seat);
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, 'This seat is already booked by someone else.', 400);
    }
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  getEvents,
  getEventDetail,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventSeating,
  bookEventSeat,
};
