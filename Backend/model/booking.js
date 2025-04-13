const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true
  },
  futsalArena: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Futsal', // Reference to FutsalArena model
    required: true
  },
  bookingDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String, // Time format like 'HH:mm'
    required: true
  },
  endTime: {
    type: String, // Time format like 'HH:mm'
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'upcoming'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    required: false,
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
  
});



const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
