const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.ObjectId;

const paymentSchema = new Schema({
  bookingId: {
    type: String,
    ref: "Booking", 
    required: true,
  },
  userId: {
    type: ObjectId  ,
    ref: "User",
    required: true,
  },
  paymentIdx: {
    type: String, 
  },
  transactionId: {
    type: String, 
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    default: "Khalti",
  },
  paymentDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Temporary fields for booking details
  // futsalArena: {
  //   type: ObjectId,
  //   ref: "Futsal",
  //   required: false,
  // },
  // bookingDate: {
  //   type: Date,
  //   required: false,
  // },
  // startTime: {
  //   type: String, // e.g., "14:00"
  //   required: false,
  // },
  // endTime: {
  //   type: String, // e.g., "15:00"
  //   required: false,
  // },
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;