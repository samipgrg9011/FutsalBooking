const User = require('../model/User');
const Futsal = require('../model/Futsal') 
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const { loggedInUsers } = require("./auth"); 
const Booking = require('../model/booking')


// const getAllUserForAdmin = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Access denied. Admins only." });
//     }
//     const users = await User.find({ role: { $ne: "admin" } }).select("-password");
//     res.status(200).json({ users });
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

const getAllUserForAdmin = async (req, res) => {
  try {
    // Ensure the logged-in user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Parse query parameters
    const {
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 5,
      role = '', // Add role query parameter
    } = req.query;

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    // Validate sort field
    const allowedSortFields = ['createdAt']; // Only allow sorting by createdAt
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortObject = { [finalSortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Build query
    let query = { role: { $ne: 'admin' } };

    // Filter by role if provided
    if (role && ['user', 'owner'].includes(role)) {
      query.role = role;
    }

    if (search) {
      // Search for users by FirstName or LastName only
      query.$or = [
        { FirstName: { $regex: search, $options: 'i' } },
        { LastName: { $regex: search, $options: 'i' } },
      ];
    }

    // Count total users for pagination
    const totalUsers = await User.countDocuments(query);

    // Fetch users
    const users = await User.find(query)
      .select('-password')
      .sort(sortObject)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    if (!users.length && totalUsers === 0) {
      return res.status(404).json({ message: 'No users found.' });
    }

    // Return users with pagination
    res.status(200).json({
      users,
      pagination: {
        totalUsers,
        currentPage: parsedPage,
        totalPages: Math.ceil(totalUsers / parsedLimit),
        limit: parsedLimit,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller to get all futsals for the admin
// const getAllFutsalsForAdmin = async (req, res) => {
//   try {
//     // Ensure the logged-in user is an admin
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Access denied. Admins only.' });
//     }

//     // Fetch all futsals (joined with user details - owner)
//     const futsals = await Futsal.find().populate('createdBy', 'FirstName LastName Email');

//     console.log('Futsals:', futsals);
  
//     if (!futsals.length) {
//       return res.status(404).json({ message: 'No futsals found.' });
//     }

//     res.status(200).json({ futsals });
//   } catch (error) {
//     console.error('Error fetching futsals:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

const getAllFutsalsForAdmin = async (req, res) => {
  try {
    // Ensure the logged-in user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // Fixed page limit
    const skip = (page - 1) * limit;

    const search = req.query.search?.trim() || ''; // Trim search term

    // Step 1: Search futsals by name or location
    const futsals = await Futsal.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ]
    })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'FirstName LastName Email');

    // Step 2: Count total futsals for pagination
    const totalFutsals = await Futsal.countDocuments({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ]
    });

    if (!futsals.length) {
      return res.status(404).json({ message: 'No futsals found matching the search.' });
    }

    // Return futsals with pagination
    res.status(200).json({
      futsals,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems: totalFutsals,
        totalPages: Math.ceil(totalFutsals / limit),
      }
    });
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
  
  getAllFutsalsForAdmin,
  deleteFutsalByAdmin,

  getAllUserForAdmin
  
};
