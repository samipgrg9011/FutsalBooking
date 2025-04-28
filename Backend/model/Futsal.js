const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const FutsalSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  pricePerHour: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  location:{
    type: String,
  },
  
  images: {
    type: [String], // Supports multiple image paths
    required: true,
    validate: {
      validator: function (value) {
        return value.length >= 3; // Ensures at least 3 images
      },
      message: "At least 3 images are required.",
    },
  },
  createdBy: {
    ref: "User",
    type: ObjectId,
    required: true,
  },


});

const Futsal = mongoose.model("Futsal", FutsalSchema);

module.exports = Futsal;
