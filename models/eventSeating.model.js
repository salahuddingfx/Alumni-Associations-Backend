const mongoose = require('mongoose');

const eventSeatingSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  tableNumber: {
    type: Number,
    required: true,
  },
  seatNumber: {
    type: Number,
    required: true,
  },
  occupiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    default: null,
  },
  occupiedByName: {
    type: String,
    default: '',
  },
  batch: {
    type: String,
    default: '',
  }
}, { timestamps: true });

// Composite unique index to prevent double booking of same seat
eventSeatingSchema.index({ eventId: 1, tableNumber: 1, seatNumber: 1 }, { unique: true });

module.exports = mongoose.model('EventSeating', eventSeatingSchema);
