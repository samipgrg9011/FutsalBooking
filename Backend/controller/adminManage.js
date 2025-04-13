const User = require('../model/User');
const Futsal = require('../model/Futsal') 
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const { loggedInUsers } = require("./auth"); 
const Booking = require('../model/booking')

const getLoggedInUsers = (req, res) => {
  try {
    // Ensure only admin can access
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

     // Filter out admins from the logged-in users
     const users = Array.from(loggedInUsers.values()).filter(user => user.role !== "admin");

    res.status(200).json({ loggedInUsers: users });
  } catch (error) {
    console.error("Error fetching logged-in users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Controller to get all futsals for the admin
const getAllFutsalsForAdmin = async (req, res) => {
  try {
    // Ensure the logged-in user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Fetch all futsals (joined with user details - owner)
    const futsals = await Futsal.find().populate('createdBy', 'FirstName LastName Email');

    console.log('Futsals:', futsals);
  
    if (!futsals.length) {
      return res.status(404).json({ message: 'No futsals found.' });
    }

    res.status(200).json({ futsals });
  } catch (error) {
    console.error('Error fetching futsals:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller to delete a futsal
const deleteFutsalByAdmin = async (req, res) => {
  try {
    // Ensure the logged-in user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const { futsalId } = req.params;

    // Check if futsal exists
    const futsal = await Futsal.findById(futsalId);
    if (!futsal) {
      return res.status(404).json({ message: 'Futsal not found.' });
    }

    // Delete the futsal
    await Futsal.findByIdAndDelete(futsalId);

    res.status(200).json({ message: 'Futsal deleted successfully.' });
  } catch (error) {
    console.error('Error deleting futsal:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



module.exports = {
  // getAllOwners,
  // deleteOwner,
  // getLoggedInUserDetails,
  // addOwner,
  // getAddedFutsal
  getAllFutsalsForAdmin,
  deleteFutsalByAdmin,
  getLoggedInUsers,
  
};
