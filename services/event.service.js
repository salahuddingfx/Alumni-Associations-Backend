const Event = require('../models/event.model');
const { getEventsCache, setEventsCache, clearEventsCache } = require('../cache/event.cache');

const listEvents = async () => {
  let cached = getEventsCache();
  if (cached) return cached;

  const events = await Event.find().sort({ date: 1 });
  setEventsCache(events);
  return events;
};

const createEvent = async (eventData) => {
  const event = new Event(eventData);
  await event.save();
  clearEventsCache();
  return event;
};

const getEventById = async (id) => {
  return await Event.findById(id);
};

const updateEvent = async (id, updateData) => {
  const event = await Event.findByIdAndUpdate(id, updateData, { new: true });
  clearEventsCache();
  return event;
};

const deleteEvent = async (id) => {
  const event = await Event.findByIdAndDelete(id);
  clearEventsCache();
  return event;
};

module.exports = {
  listEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
};
