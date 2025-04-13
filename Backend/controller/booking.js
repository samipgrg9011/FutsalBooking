
const Booking = require("../model/booking");
const { initiateKhaltiPayment } = require("./PaymentController");
const Payment = require("../model/payment")



// const makeBooking = async (req, res, next) => {
//   try {
//         console.log("Request Body:", req.body);
//     const { futsalArena, bookingDate, startTime, endTime, totalAmount } = req.body;

//     // Validate input
//     if (!futsalArena || !bookingDate || !startTime || !endTime || !totalAmount) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Check for overlapping bookings
//     const existingBooking = await Booking.findOne({
//       futsalArena,
//       bookingDate,
//       $or: [
//         { startTime: { $lt: endTime }, endTime: { $gt: startTime } } // Overlapping condition
//       ]
//     });

//     if (existingBooking) {
//       return res.status(400).json({ message: "Slot already booked. Please choose another time." });
//     }

//     // Create a new booking with pending status
//     const booking = new Booking({
//       user: req.user._id,
//       futsalArena,  
//       bookingDate,
//       startTime,
//       endTime,
//       totalAmount,
//       status: "pending", // Initially pending until payment is confirmed
//     });


//     // Initiate Khalti payment
//     const paymentDetails = await initiateKhaltiPayment({
//       bookingId: booking._id,
//       totalPrice: totalAmount,
//       user: req.user
//     });

//     // Save the booking first
//     await booking.save();

//         console.log("Booking Status after saving:", booking.status); // Log booking status


//     // Create a new payment record
//     const payment = new Payment({
//       bookingId: booking._id.toString(),
//       userId: req.user._id,
//       paymentIdx: paymentDetails.pidx, // Khalti's payment index
//       amount: totalAmount,
//       paymentStatus: "pending", // Will update to "completed" after verification
//       paymentMethod: "Khalti",
//     });

//     await payment.save();



//     // Return the booking and payment details
//     res.status(201).json({ 
//       message: "Booking created and payment initiated successfully", 
//       booking,
//       paymentUrl: paymentDetails.paymentUrl,
//       paymentId: payment._id
//     });

//   } catch (err) {
//     next(err);
//   }
// };


// const makeBooking = async (req, res, next) => {
//   try {
//     const { futsalArena, bookingDate, startTime, endTime, totalAmount } = req.body;

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

//     const tempBookingId = `TEMP-${Date.now()}-${req.user._id}`;

//     const paymentDetails = await initiateKhaltiPayment({
//       bookingId: tempBookingId,
//       totalPrice: totalAmount,
//       user: req.user,
//     });

//     const payment = new Payment({
//       bookingId: tempBookingId,
//       userId: req.user._id,
//       futsalArena,
//       bookingDate,
//       startTime,
//       endTime,
//       amount: totalAmount,
//       paymentIdx: paymentDetails.pidx,
//       paymentStatus: "pending",
//       paymentMethod: "Khalti",
//     });

//     await payment.save();

//     res.status(201).json({
//       message: "Payment initiated",
//       paymentUrl: paymentDetails.paymentUrl,
//       paymentId: payment._id,
//       tempBookingId,
//     });

//   } catch (err) {
//     console.error("Error initiating booking:", err.message);
//     next(err);
//   }
// };


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
  
      const bookings = await Booking.find({ user: req.user._id })
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

    // Fetch booked slots for the selected date
    const bookedSlots = await Booking.find({ futsalArena, bookingDate }).select("startTime endTime");

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

      // Mark as booked if the slot is already booked
      const isBooked = bookedSlots.some(booked => 
        slot.startTime < booked.endTime && slot.endTime > booked.startTime 
  

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
const getAllBookingsOfUsers = async (req, res) => {
  try {
    // Log the user details for debugging purposes
    console.log("User Role:", req.user.role);
    console.log("User ID:", req.user._id);

    // Ensure the logged-in user is an owner
    if (req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Owners only.' });
    }

    // Fetch all bookings, filtering by the futsal arenas owned by the logged-in user
    const bookings = await Booking.find()
      .populate({
        path: 'futsalArena',
        match: { createdBy: req.user._id }, // Ensure the futsal arena is created by the logged-in user
        select: 'name location'
      })
      .populate('user', 'FirstName LastName Email') // Populate user data
      .sort({ bookingDate: 1, startTime: 1 });

    // Filter out null entries where futsalArena didn't match the owner
    const ownerBookings = bookings.filter(booking => booking.futsalArena);

    if (!ownerBookings.length) {
      return res.status(404).json({ message: 'No bookings found for your futsal arenas.' });
    }

    // Return the filtered bookings
    res.status(200).json({ bookings: ownerBookings });
  } catch (error) {
    // Enhanced error logging to better understand where it failed
    console.error('Error fetching bookings:', error.message);
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




module.exports = {
  makeBooking,
  getBookings, 
  getAvailableSlots,
  getAllBookingsOfUsers,
  deleteBooking
};

