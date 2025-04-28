
const Booking = require("../model/booking");
const { initiateKhaltiPayment } = require("./PaymentController");
const Payment = require("../model/payment");
const User = require("../model/User");

const { getAllFutsalsForAdmin } = require("./adminManage");

const Futsal = require("../model/Futsal"); // Adjust path to your Futsal model



const makeBooking = async (req, res, next) => {
  try {
    const { futsalArena, bookingDate, startTime, endTime, totalAmount } = req.body;

    if (!futsalArena || !bookingDate || !startTime || !endTime || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check for overlapping bookings
    const existingBooking = await Booking.findOne({
      futsalArena,
      bookingDate,
      status: { $ne: "cancelled" },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Slot already booked." });
    }

    //Create Booking with status "pending"
    const newBooking = new Booking({
      user: req.user._id,
      futsalArena,
      bookingDate,
      startTime,
      endTime,
      totalAmount,
      status: "pending",
    });

    // await newBooking.save();

    // Initiate Khalti Payment
    const paymentDetails = await initiateKhaltiPayment({
      bookingId: newBooking._id,
      totalPrice: totalAmount,
      user: req.user,
    });

    await newBooking.save();

    // Step 3: Create a Payment record
    const payment = new Payment({
      bookingId: newBooking._id,
      userId: req.user._id,
      futsalArena,
      bookingDate,
      startTime,
      endTime,
      amount: totalAmount,
      paymentIdx: paymentDetails.pidx,
      paymentStatus: "pending",
      paymentMethod: "Khalti",
    });

    await payment.save();

    res.status(201).json({
      message: "Payment initiated",
      paymentUrl: paymentDetails.paymentUrl,
      paymentId: payment._id,
      bookingId: newBooking._id,
    });

  } catch (err) {
    console.error("Error initiating booking:", err.message);
    res.status(500).json({ message: "Internal server error", error: err.message });
    next(err);
  }
};


//without payment 
// const makeBooking = async (req, res, next) => {
//   try {
//     const { futsalArena, bookingDate, startTime, endTime, totalAmount } = req.body;

//     // Validate required fields
//     if (!futsalArena || !bookingDate || !startTime || !endTime || !totalAmount) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Check for overlapping bookings
//     const existingBooking = await Booking.findOne({
//       futsalArena,
//       bookingDate,
//       $or: [
//         { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
//       ],
//     });

//     if (existingBooking) {
//       return res.status(400).json({ message: "Slot already booked." });
//     }

//     // Create booking with status "pending"
//     const newBooking = new Booking({
//       user: req.user._id,
//       futsalArena,
//       bookingDate,
//       startTime,
//       endTime,
//       totalAmount,
//       status: "pending",
//     });

//     // Save the new booking
//     await newBooking.save();

//     // Return the created booking details in the response
//     res.status(201).json({
//       message: "Booking created successfully",
//       bookingId: newBooking._id,
//       status: newBooking.status,
//     });

//   } catch (err) {
//     console.error("Error initiating booking:", err.message);
//     res.status(500).json({ message: "Internal server error", error: err.message });
//     next(err);
//   }
// };



  // const getBookings = async (req, res, next) => {
  //   try {
  //     // Fetch bookings for the authenticated user and populate futsal details
  //     const bookings = await Booking.find({ user: req.user._id })
  //       .populate("futsalArena", "name location images") // Populate required fields
  //       .sort({ bookingDate: 1, startTime: 1 }); // Sort by date first, then start time

  //     res.status(200).json(bookings); // Return populated bookings data
  //   } catch (err) {
  //     console.error(err); 
  //     next(err); // Pass the error to the error-handling middleware
  //   }
  // };

  //with current 
  const getBookings = async (req, res, next) => {
    try {
      const now = new Date();
  
      const bookings = await Booking.find(
        { user: req.user._id , 
          status: { $ne: "cancelled" } //
        })
        .populate("futsalArena", "name location images")
        .sort({ bookingDate: 1, startTime: 1 });
  
      const result = {
        completed: [],
        current: [],
        upcoming: []
      };
  
      for (const booking of bookings) {
        const bookingStart = new Date(booking.bookingDate);
        const bookingEnd = new Date(booking.bookingDate);
  
        const [startHour, startMinute] = booking.startTime.split(':').map(Number);
        const [endHour, endMinute] = booking.endTime.split(':').map(Number);
  
        bookingStart.setHours(startHour, startMinute);
        bookingEnd.setHours(endHour, endMinute);
  
        console.log("\n--- Booking Debug ---");
        console.log("Booking ID:", booking._id);
        console.log("Status:", booking.status);
        console.log("Start:", bookingStart.toISOString());
        console.log("End:", bookingEnd.toISOString());
        console.log("Now:", now.toISOString());
  
        // Check if booking has already passed
        if (now > bookingEnd) {
          // If it's not marked completed, optionally update it
          if (booking.status !== 'completed') {
            booking.status = 'completed';
            await booking.save(); // Save updated status to DB
          }
          result.completed.push(booking);
          console.log("=> Categorized as: COMPLETED (auto-updated if needed)");
        } else if (now >= bookingStart && now <= bookingEnd) {
          result.current.push(booking);
          console.log("=> Categorized as: CURRENT");
        } else {
          result.upcoming.push(booking);
          console.log("=> Categorized as: UPCOMING");
        }
      }
  
      res.status(200).json(result);
    } catch (err) {
      console.error("Get bookings error:", err.message);
      res.status(500).json({ message: "Something went wrong" });
    }
  };

  
  
  //without current 
  // const getBookings = async (req, res, next) => {
  //   try {
  //     const now = new Date();
  
  //     // Fetch bookings for the authenticated user
  //     const bookings = await Booking.find({ user: req.user._id })
  //       .populate("futsalArena", "name location images")
  //       .sort({ bookingDate: 1, startTime: 1 });
  
  //     const result = {
  //       completed: [],
  //       upcoming: []
  //     };
  
  //     bookings.forEach(booking => {
  //       // Combine bookingDate with startTime and endTime
  //       const bookingStart = new Date(booking.bookingDate);
  //       const bookingEnd = new Date(booking.bookingDate);
  
  //       const [startHour, startMinute] = booking.startTime.split(':').map(Number);
  //       const [endHour, endMinute] = booking.endTime.split(':').map(Number);
  
  //       bookingStart.setHours(startHour, startMinute);
  //       bookingEnd.setHours(endHour, endMinute);
  
  //       console.log("\n--- Booking Debug ---");
  //       console.log("Booking ID:", booking._id);
  //       console.log("Status:", booking.status);
  //       console.log("Start:", bookingStart.toISOString());
  //       console.log("End:", bookingEnd.toISOString());
  //       console.log("Now:", now.toISOString());
  
  //       // Categorize bookings
  //       if (booking.status === 'completed') {
  //         result.completed.push(booking);
  //         console.log("=> Categorized as: COMPLETED");
  //       } else if (now < bookingStart) {
  //         result.upcoming.push(booking);
  //         console.log("=> Categorized as: UPCOMING");
  //       }
  
      
  //     });
  
  //     res.status(200).json(result);
  //   } catch (err) {
  //     console.error("Get bookings error:", err.message);
  //     res.status(500).json({ message: "Something went wrong" });
  //   }
  // };
  
  
// const getAvailableSlots = async (req, res, next) => {
//   try {
//     const { futsalArena, bookingDate } = req.query;

//     if (!futsalArena || !bookingDate) {
//       return res.status(400).json({ message: "Futsal arena and booking date are required" });
//     }

//     // Define working hours (6 AM - 10 PM)
//     const openingTime = 6; // 6 AM
//     const closingTime = 22; // 10 PM
//     const slotDuration = 1; // 1 hour

//     // Generate all slots
//     const allSlots = [];
//     for (let hour = openingTime; hour < closingTime; hour += slotDuration) {
//       allSlots.push({
//         startTime: `${hour}:00`,
//         endTime: `${hour + slotDuration}:00`,
//         status: "available", // Default status
//       });
//     }

//     // Get current date and time
//     const currentDate = new Date();
//     const currentHour = currentDate.getHours(); // Current hour in 24-hour format
//     const currentMinute = currentDate.getMinutes();

//     // Parse the bookingDate to compare
//     const bookingDateObject = new Date(bookingDate);
//     const isSameDay = bookingDateObject.toDateString() === currentDate.toDateString();

//     // Fetch booked slots for the selected date
//     const bookedSlots = await Booking.find({ 
//       futsalArena, 
//       bookingDate,
//       status: { $ne: "cancelled" }
//     }).select("startTime endTime");

//     // Filter slots for the selected date
//     const updatedSlots = allSlots.map(slot => {
//       const slotStartHour = parseInt(slot.startTime.split(":")[0]);

//       // Check if the slot is in the past (before current time)
//       let isBeforeCurrentTime = false;
//       if (isSameDay && slotStartHour < currentHour) {
//         isBeforeCurrentTime = true;
//       } else if (isSameDay && slotStartHour === currentHour && currentMinute > 0) {
//         isBeforeCurrentTime = true;
//       }

//       // Mark as booked if the slot is already booked
//       const isBooked = bookedSlots.some(booked => 
//         slot.startTime < booked.endTime && slot.endTime > booked.startTime 
  

//       );

//       // Disable slots before the current time
//       return {
//         ...slot,
//         status: isBooked || isBeforeCurrentTime ? "booked" : "available",
//       };
//     });

//     res.status(200).json({ slots: updatedSlots });
//   } catch (err) {
//     next(err);
//   }
// };
const getAvailableSlots = async (req, res, next) => { 
  try {
    const { futsalArena, bookingDate } = req.query;

    if (!futsalArena || !bookingDate) {
      return res.status(400).json({ message: "Futsal arena and booking date are required" });
    }

    // Define working hours (6 AM - 10 PM)
    const openingTime = 6; // 6 AM
    const closingTime = 22; // 10 PM
    const slotDuration = 1; // 1 hour

    // Generate all slots
    const allSlots = [];
    for (let hour = openingTime; hour < closingTime; hour += slotDuration) {
      allSlots.push({
        startTime: `${hour}:00`,
        endTime: `${hour + slotDuration}:00`,
        status: "available", // Default status
      });
    }

    // Get current date and time
    const currentDate = new Date();
    const currentHour = currentDate.getHours(); // Current hour in 24-hour format
    const currentMinute = currentDate.getMinutes();

    // Parse the bookingDate to compare
    const bookingDateObject = new Date(bookingDate);
    const isSameDay = bookingDateObject.toDateString() === currentDate.toDateString();

    // Fetch booked slots for the selected date (exclude cancelled bookings)
    const bookedSlots = await Booking.find({ 
      futsalArena, 
      bookingDate,
      status: { $ne: "cancelled" }
    }).select("startTime endTime status");

    // Filter slots for the selected date
    const updatedSlots = allSlots.map(slot => {
      const slotStartHour = parseInt(slot.startTime.split(":")[0]);

      // Check if the slot is in the past (before current time)
      let isBeforeCurrentTime = false;
      if (isSameDay && slotStartHour < currentHour) {
        isBeforeCurrentTime = true;
      } else if (isSameDay && slotStartHour === currentHour && currentMinute > 0) {
        isBeforeCurrentTime = true;
      }

      // Check if the slot is booked or cancelled
      const isBooked = bookedSlots.some(booked => 
        slot.startTime < booked.endTime && slot.endTime > booked.startTime && booked.status !== "cancelled"
      );

      // Disable slots before the current time
      return {
        ...slot,
        status: isBooked || isBeforeCurrentTime ? "booked" : "available",
      };
    });

    res.status(200).json({ slots: updatedSlots });
  } catch (err) {
    next(err);
  }
};

  

// Controller to get all bookings for owner
// const getAllBookingsOfUsers = async (req, res) => {
//   try {
//     // Log the user details for debugging purposes
//     console.log("User Role:", req.user.role);
//     console.log("User ID:", req.user._id);

//     // Ensure the logged-in user is an owner
//     if (req.user.role !== 'owner') {
//       return res.status(403).json({ message: 'Access denied. Owners only.' });
//     }

//     // Fetch all bookings, filtering by the futsal arenas owned by the logged-in user
//     const bookings = await Booking.find()
//       .populate({
//         path: 'futsalArena',
//         match: { createdBy: req.user._id }, // Ensure the futsal arena is created by the logged-in user
//         select: 'name location'
//       })
//       .populate('user', 'FirstName LastName Email') // Populate user data
//       .sort({ bookingDate: 1, startTime: 1 });

//     // Filter out null entries where futsalArena didn't match the owner
//     const ownerBookings = bookings.filter(booking => booking.futsalArena);

//     if (!ownerBookings.length) {
//       return res.status(404).json({ message: 'No bookings found for your futsal arenas.' });
//     }

//     // Return the filtered bookings
//     res.status(200).json({ bookings: ownerBookings });
//   } catch (error) {
//     // Enhanced error logging to better understand where it failed
//     console.error('Error fetching bookings:', error.message);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


// const getAllBookingsOfUsers = async (req, res) => {
//   try {
//     console.log("User Role:", req.user.role);
//     console.log("User ID:", req.user._id);

//     if (req.user.role !== "owner") {
//       return res.status(403).json({ message: "Access denied. Owners only." });
//     }

//     const page = parseInt(req.query.page) || 1;
//     const limit = 5; // Fixed page limit
//     const skip = (page - 1) * limit;

//     const sortBy = req.query.sortBy || "bookingDate";
//     const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
//     const search = req.query.search?.trim() || ""; // Trim search term

//     const allowedSortFields = ["bookingDate", "createdAt"];
//     if (!allowedSortFields.includes(sortBy)) {
//       return res.status(400).json({ message: "Invalid sort field" });
//     }

//     const sortObject = { [sortBy]: sortOrder };

//     // Step 1: Find futsal arenas owned by the user matching the search
//     const futsals = await Futsal.find({
//       createdBy: req.user._id,
//       name: { $regex: search, $options: "i" },
//     }).select("_id");

//     const futsalIds = futsals.map((f) => f._id);

//     if (!futsalIds.length) {
//       return res.status(404).json({ message: "No futsal arenas found matching the search." });
//     }

//     // Step 2: Find bookings that match those futsal IDs
//     const bookingsQuery = Booking.find({
//       futsalArena: { $in: futsalIds },
//     })
//       .populate("futsalArena", "name location")
//       .populate("user", "FirstName LastName Email")
//       .sort(sortObject)
//       .skip(skip)
//       .limit(limit);

//     const bookings = await bookingsQuery;

//     // Step 3: Count total bookings for pagination
//     const totalBookings = await Booking.countDocuments({
//       futsalArena: { $in: futsalIds },
//     });

//     if (!bookings.length) {
//       return res.status(404).json({ message: "No bookings found for the matching futsal arenas." });
//     }

//     res.status(200).json({
//       bookings,
//       pagination: {
//         currentPage: page,
//         pageSize: limit,
//         totalItems: totalBookings,
//         totalPages: Math.ceil(totalBookings / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching bookings:", error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
const getAllBookingsOfUsers = async (req, res) => {
  try {
    console.log('User Role:', req.user.role);
    console.log('User ID:', req.user._id);

    if (req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Owners only.' });
    }

    const {
      search = '',
      sortBy = 'bookingDate',
      sortOrder = 'desc',
      page = 1,
      limit = 5,
    } = req.query;

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    // Find futsal arenas owned by the user
    const ownerFutsals = await Futsal.find({ createdBy: req.user._id }).select('_id name');
    if (!ownerFutsals.length) {
      return res.status(404).json({ message: 'No futsal arenas found for this owner.' });
    }
    const futsalIds = ownerFutsals.map((futsal) => futsal._id);

    // Build query
    let query = { futsalArena: { $in: futsalIds } };

    if (search) {
      // Search for users by FirstName or LastName
      const userQuery = {
        $or: [
          { FirstName: { $regex: search, $options: 'i' } },
          { LastName: { $regex: search, $options: 'i' } },
        ],
      };
      const users = await User.find(userQuery).select('_id');
      const userIds = users.map((user) => user._id);

      // Search for futsal arenas by name
      const futsalQuery = { name: { $regex: search, $options: 'i' }, _id: { $in: futsalIds } };
      const matchingFutsals = await Futsal.find(futsalQuery).select('_id');
      const matchingFutsalIds = matchingFutsals.map((futsal) => futsal._id);

      // Combine search conditions
      query.$or = [
        ...(userIds.length > 0 ? [{ user: { $in: userIds } }] : []),
        ...(matchingFutsalIds.length > 0 ? [{ futsalArena: { $in: matchingFutsalIds } }] : []),
      ];
    }

    // Sort setup
    const validSortFields = ['bookingDate', 'totalAmount', 'createdAt'];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'bookingDate';
    const sortOptions = {};
    sortOptions[finalSortBy] = sortOrder === 'asc' ? 1 : -1;

    // Total count for pagination
    const totalBookings = await Booking.countDocuments(query);

    // Fetch bookings
    const bookings = await Booking.find(query)
      .populate({
        path: 'futsalArena',
        select: 'name location',
      })
      .populate('user', 'FirstName LastName Email')
      .sort(sortOptions)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    console.log('Bookings fetched:', bookings.length);

    if (bookings.length === 0 && totalBookings === 0) {
      return res.status(404).json({ message: 'No bookings found for your futsal arenas.' });
    }

    res.status(200).json({
      bookings,
      pagination: {
        totalBookings,
        currentPage: parsedPage,
        totalPages: Math.ceil(totalBookings / parsedLimit),
        limit: parsedLimit,
      },
    });
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Controller to get all bookings for admin
// const getAllBookingsForAdmin = async (req, res) => {
//   try {
//     // Ensure the logged-in user is an admin
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Access denied. Admins only.' });
//     }

//     // Fetch all bookings with populated futsal and user details
//     const bookings = await Booking.find()
//       .populate({
//         path: 'futsalArena',
//         select: 'name location createdBy'
//       })
//       .populate('user', 'FirstName LastName Email')
//       .sort({ bookingDate: 1, startTime: 1 });

//     if (!bookings.length) {
//       return res.status(404).json({ message: 'No bookings found.' });
//     }

//     // Return all bookings
//     res.status(200).json({ bookings });
//   } catch (error) {
//     console.error('Error fetching all bookings for admin:', error.message);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };
// const getAllBookingsForAdmin = async (req, res) => {
//   try {
//     // Ensure the logged-in user is an admin
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Access denied. Admins only." });
//     }

//     // Parse query parameters
//     const page = parseInt(req.query.page) || 1;
//     const limit = 5; // Fixed page limit, matching getAllBookingsOfUsers
//     const skip = (page - 1) * limit;

//     const sortBy = req.query.sortBy || "bookingDate";
//     const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
//     const search = req.query.search?.trim() || ""; // Trim search term

//     // Validate sort field
//     const allowedSortFields = ["bookingDate"];
//     if (!allowedSortFields.includes(sortBy)) {
//       return res.status(400).json({ message: "Invalid sort field" });
//     }

//     const sortObject = { [sortBy]: sortOrder };

//     // Step 1: Find futsal arenas matching the search term
//     const futsals = await Futsal.find({
//       name: { $regex: search, $options: "i" },
//     }).select("_id");

//     const futsalIds = futsals.map((f) => f._id);

//     // If no futsal arenas match the search, return early
//     if (!futsalIds.length) {
//       return res.status(404).json({ message: "No futsal arenas found matching the search." });
//     }

//     // Step 2: Find bookings for matching futsal arenas
//     const bookingsQuery = Booking.find({
//       futsalArena: { $in: futsalIds },
//     })
//       .populate({
//         path: "futsalArena",
//         select: "name location createdBy",
//       })
//       .populate("user", "FirstName LastName Email")
//       .sort(sortObject)
//       .skip(skip)
//       .limit(limit);

//     const bookings = await bookingsQuery;

//     // Step 3: Count total bookings for pagination
//     const totalBookings = await Booking.countDocuments({
//       futsalArena: { $in: futsalIds },
//     });

//     if (!bookings.length) {
//       return res.status(404).json({ message: "No bookings found for the matching futsal arenas." });
//     }

//     // Return bookings with pagination
//     res.status(200).json({
//       bookings,
//       pagination: {
//         currentPage: page,
//         pageSize: limit,
//         totalItems: totalBookings,
//         totalPages: Math.ceil(totalBookings / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching all bookings for admin:", error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

const getAllBookingsForAdmin = async (req, res) => {
  try {
    // Ensure the logged-in user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Parse query parameters
    const {
      search = '',
      sortBy = 'bookingDate',
      sortOrder = 'desc',
      page = 1,
      limit = 5,
    } = req.query;

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    // Validate sort field
    const allowedSortFields = ['bookingDate', 'totalAmount'];
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'bookingDate';
    const sortObject = { [finalSortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Build query
    let query = {};

    if (search) {
      // Search for users by FirstName or LastName
      const userQuery = {
        $or: [
          { FirstName: { $regex: search, $options: 'i' } },
          { LastName: { $regex: search, $options: 'i' } },
        ],
      };
      const users = await User.find(userQuery).select('_id');
      const userIds = users.map((user) => user._id);

      // Search for futsal arenas by name
      const futsalQuery = { name: { $regex: search, $options: 'i' } };
      const futsals = await Futsal.find(futsalQuery).select('_id');
      const futsalIds = futsals.map((futsal) => futsal._id);

      // Combine search conditions
      query.$or = [
        ...(userIds.length > 0 ? [{ user: { $in: userIds } }] : []),
        ...(futsalIds.length > 0 ? [{ futsalArena: { $in: futsalIds } }] : []),
      ];

      // If no users or futsals match, return early
      if (!userIds.length && !futsalIds.length) {
        return res.status(404).json({ message: 'No bookings found matching the search.' });
      }
    }

    // Count total bookings for pagination
    const totalBookings = await Booking.countDocuments(query);

    // Fetch bookings
    const bookings = await Booking.find(query)
      .populate({
        path: 'futsalArena',
        select: 'name location createdBy',
      })
      .populate('user', 'FirstName LastName Email')
      .sort(sortObject)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    if (!bookings.length && totalBookings === 0) {
      return res.status(404).json({ message: 'No bookings found.' });
    }

    // Return bookings with pagination
    res.status(200).json({
      bookings,
      pagination: {
        totalBookings,
        currentPage: parsedPage,
        totalPages: Math.ceil(totalBookings / parsedLimit),
        limit: parsedLimit,
      },
    });
  } catch (error) {
    console.error('Error fetching all bookings for admin:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🗑 Deleting booking with ID:", id);

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await Booking.findByIdAndDelete(id);
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error(" Error deleting booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



const updateBookingStatus = async (req, res) => {

  try {
    // Get current time
    const now = new Date();

    // Fetch all bookings
    const bookings = await Booking.find({});

    // Iterate through each booking
    for (const booking of bookings) {
      // Combine bookingDate with startTime and endTime
      const [startHour, startMinute] = booking.startTime.split(':').map(Number);
      const [endHour, endMinute] = booking.endTime.split(':').map(Number);

      // Create Date objects for start and end times
      const startDateTime = new Date(booking.bookingDate);
      startDateTime.setHours(startHour, startMinute, 0, 0);

      const endDateTime = new Date(booking.bookingDate);
      endDateTime.setHours(endHour, endMinute, 0, 0);

      // Determine new status
      let newStatus;
      if (now < startDateTime) {
        newStatus = 'upcoming';
      } else if (now >= startDateTime && now <= endDateTime) {
        newStatus = 'pending';
      } else if (now > endDateTime) {
        newStatus = 'completed';
      }

      // Update status if it has changed
      if (booking.status !== newStatus) {
        booking.status = newStatus;
        booking.updatedAt = now;
        await booking.save();
        console.log(`Updated booking ${booking._id} to status: ${newStatus}`);
      }
    }

    console.log('Booking status update completed.');
  } catch (error) {
    console.error('Error updating booking statuses:', error);
  }
}

const startBookingStatusUpdater = async(req, res) => {
  console.log('Starting booking status updater...');
  await updateBookingStatus(); // Run immediately on start
  setInterval(updateBookingStatus, 60 * 60 * 1000); // Run every hour (3600000 ms)
}

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params; // Booking ID from URL params
    console.log("🚫 Cancelling booking with ID:", id);

    // Find the booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the user is authorized to cancel (either the booking owner or an admin)
    if (req.user._id.toString() !== booking.user.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. You are not authorized to cancel this booking." });
    }

    // Check if the booking can be cancelled (not started or completed)
    const now = new Date();
    const bookingStart = new Date(booking.bookingDate);
    const [startHour, startMinute] = booking.startTime.split(':').map(Number);
    bookingStart.setHours(startHour, startMinute);

    if (now >= bookingStart || booking.status === "completed") {
      return res.status(400).json({ message: "Cannot cancel a booking that has started or is completed." });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled." });
    }

    // Update booking status to "cancelled"
    booking.status = "cancelled";
    await booking.save();


    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {
  makeBooking,
  getBookings, 
  getAvailableSlots,
  getAllBookingsOfUsers,
  deleteBooking,
  getAllBookingsForAdmin,
  startBookingStatusUpdater,
  cancelBooking

};

