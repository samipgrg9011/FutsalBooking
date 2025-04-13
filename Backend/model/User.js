const mongoose = require("mongoose");
const { ADMIN, USER, OWNER } = require("../Constants/User");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  FirstName: {
    type: String,
    required: true,
    trim: true,
  },
  LastName: {
    type: String,
    required: true,
    trim: true,
  },

  Email: {
    type: String,
    required: true,
    unique: true, // Ensures uniqueness in DB
    validate: {
      validator: async function (value) {
        // Check if email is being updated
        const existingUser = await mongoose.models.User.findOne({ Email: value });
        if (existingUser && existingUser._id.toString() !== this._id.toString()) {
          // The email already exists and it's not the current user's email
          return false;
        }
        return true;
      },
      message: "Email is already in use",
    },
  },

  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    required: true,
    enum: [ADMIN, USER, OWNER],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  phoneNumber: {
    type: String,
    required: false,
    trim: true,
    unique: true, // Ensures uniqueness in DB
    validate: {
      validator: async function (value) {
        // Check if phone number is being updated
        const existingUser = await mongoose.models.User.findOne({ phoneNumber: value });
        if (existingUser && existingUser._id.toString() !== this._id.toString()) {
          // The phone number already exists and it's not the current user's phone number
          return false;
        }
        return true;
      },
      message: "Phone number is already in use",
    },
  },

  address: {
    type: String,
    required: false,
    trim: true,
  },
  profileImage: {
    type: String, // Store the image name
    default: null,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
