
const axios = require("axios");
const Payment = require("../model/payment");
const Booking = require("../model/booking");
const Futsal = require("../model/Futsal");
const User = require("../model/User");



// const KhaltiURL = process.env.KHALTI_URL;
const khaltiSecretKey = process.env.KHALTI_SECRET_KEY;

const initiateKhaltiPayment = async ({ bookingId, totalPrice, user }) => {
  try {

    const paymentData = {
      return_url: "http://localhost:5173/booking/success/",
      website_url: "http://localhost:5173/",
      amount: totalPrice * 100,
      purchase_order_id: bookingId,
      purchase_order_name: "Futsal Booking",
      customer_info: {
        name: user.FirstName || "Guest",
        email: user.Email || "guest@example.com",
        phone: user.phoneNumber || "9800000000",
      },
    };

    const response = await axios.post(
      `https://dev.khalti.com/api/v2/epayment/initiate/`,
      paymentData,
      {
        headers: {
          Authorization: `Key ${khaltiSecretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { pidx, payment_url } = response.data;
    return { paymentUrl: payment_url, pidx };
  } catch (err) {
    console.error("Payment initiation error:", err.response?.data || err.message);
    throw new Error(`Payment initiation failed: ${err.message}`);
  }
};




// const verifyKhaltiPayment = async (req, res) => {
//   try {
//     const { pidx, transaction_id, amount, purchase_order_id } = req.query;

//     // Log the full URL for debugging
//     const verificationUrl = `https://dev.khalti.com/api/v2/epayment/lookup/`;
//     console.log(`Verifying payment using URL: ${verificationUrl}`);

//     // Send a POST request to the Khalti verification endpoint
//     const verifyResponse = await axios.post(
//       verificationUrl,
//       { pidx },
//       {
//         headers: {
//           Authorization: `Key ${khaltiSecretKey}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     // Log the response data to debug
//     console.log("Khalti response data:", verifyResponse.data);

//     // Check if the payment status is "Completed"
//     const paymentStatus = verifyResponse.data.status;

//     if (paymentStatus === "Completed") {
//       const payment = await Payment.findOneAndUpdate(
//         { bookingId: purchase_order_id },
//         {
//           paymentStatus: "completed",
//           transactionId: transaction_id,
//           paymentDate: new Date(),
//         },
//         { new: true }
//       );

//       if (!payment) {
//         return res.status(404).json({ error: "Payment record not found." });
//       }
//       res.status(200).json({status :"success"})
      
//     } else if (paymentStatus === "User canceled") {
//       // If payment is canceled by the user, delete payment and booking records
//       const payment = await Payment.findOne({ bookingId: purchase_order_id });
//       const booking = await Booking.findOne({ _id: purchase_order_id });

//       if (payment && booking) {
//         // Delete payment and booking records
//         await Payment.deleteOne({ bookingId: purchase_order_id });
//         await Booking.deleteOne({ _id: purchase_order_id });

//         console.log(
//           `Payment and booking deleted for bookingId: ${purchase_order_id} due to user cancellation`
//         );
//       }

//       res.redirect("http://localhost:5173/booking/failure");

//     } else {
//       // If payment fails, delete payment and booking records
//       const payment = await Payment.findOne({ bookingId: purchase_order_id });
//       const booking = await Booking.findOne({ _id: purchase_order_id });

//       if (payment && booking) {
//         // Delete payment and booking records
//         await Payment.deleteOne({ bookingId: purchase_order_id });
//         await Booking.deleteOne({ _id: purchase_order_id });

//         console.log(
//           `Payment and booking deleted for bookingId: ${purchase_order_id} due to payment failure`
//         );
//       }

//       res.redirect("http://localhost:5173/booking/failure");
//     }
//   } catch (err) {
//     // Log the error details for better debugging
//     console.error("Error verifying payment:", err.message);

//     // Handle 404 error specifically for missing Khalti endpoint
//     if (err.response && err.response.status === 404) {
//       return res.status(404).json({
//         error: "Payment verification failed. Khalti endpoint not found.",
//         details: err.message,
//       });
//     }

//     // Handle other errors
//     res.status(500).json({
//       error: "Payment verification failed.",
//       details: err.message,
//     });
//   }
// };



const verifyKhaltiPayment = async (req, res) => {
  try {
    const { pidx, transaction_id, amount, purchase_order_id } = req.query;
    console.log(`Verifying payment for pidx: ${pidx}, bookingId: ${purchase_order_id}`);

    const verificationUrl = `https://dev.khalti.com/api/v2/epayment/lookup/`;
    console.log(`Verifying payment using URL: ${verificationUrl}`);

    const verifyResponse = await axios.post(
      verificationUrl,
      { pidx },
      {
        headers: {
          Authorization: `Key ${khaltiSecretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Khalti response data:", verifyResponse.data);
    const paymentStatus = verifyResponse.data.status;
    console.log(`Payment status: ${paymentStatus}`);

    if (paymentStatus === "Completed") {
      const payment = await Payment.findOneAndUpdate(
        { bookingId: purchase_order_id },
        {
          paymentStatus: "completed",
          transactionId: transaction_id,
          paymentDate: new Date(),
        },
        { new: true }
      );

      if (!payment) {
        console.log(`Payment record not found for bookingId: ${purchase_order_id}`);
        return res.status(404).json({ error: "Payment record not found." });
      }
      console.log(`Payment updated to completed for bookingId: ${purchase_order_id}`);
      res.status(200).json({ status: "success" });
    } else {
      console.log(`Handling non-completed status: ${paymentStatus}`);
      const payment = await Payment.findOne({ bookingId: purchase_order_id });
      const booking = await Booking.findOne({ _id: purchase_order_id });

      console.log(`Payment record exists: ${!!payment}, Booking record exists: ${!!booking}`);

      if (payment || booking) {
        if (payment) {
          await Payment.deleteOne({ bookingId: purchase_order_id });
          console.log(`Deleted payment for bookingId: ${purchase_order_id}`);
        }
        if (booking) {
          await Booking.deleteOne({ _id: purchase_order_id });
          console.log(`Deleted booking for bookingId: ${purchase_order_id}`);
        }
      } else {
        console.log(`No records found to delete for bookingId: ${purchase_order_id}`);
      }

      res.redirect("http://localhost:5173/booking/failure");
    }
  } catch (err) {
    console.error(`Error verifying payment for pidx: ${req.query.pidx}`, err.message);
    console.error("Full error:", err.response?.data || err);

    if (err.response && err.response.status === 404) {
      console.log(`Khalti endpoint not found, attempting cleanup for bookingId: ${req.query.purchase_order_id}`);
      const payment = await Payment.findOne({ bookingId: req.query.purchase_order_id });
      const booking = await Booking.findOne({ _id: req.query.purchase_order_id });

      if (payment || booking) {
        if (payment) {
          await Payment.deleteOne({ bookingId: req.query.purchase_order_id });
          console.log(`Deleted payment due to 404 error for bookingId: ${req.query.purchase_order_id}`);
        }
        if (booking) {
          await Booking.deleteOne({ _id: req.query.purchase_order_id });
          console.log(`Deleted booking due to 404 error for bookingId: ${req.query.purchase_order_id}`);
        }
      }
      return res.status(404).json({
        error: "Payment verification failed. Khalti endpoint not found.",
        details: err.message,
      });
    }

    res.status(500).json({
      error: "Payment verification failed.",
      details: err.message,
    });
  }
};





// const getPaymentsForArena = async (req, res) => {
//   try {
//     const user = req.user;
//     const futsals = await Futsal.find({ createdBy: user._id }).select('_id');
//     console.log('Futsal arenas found:', futsals);

//     if (!futsals || futsals.length === 0) {
//       return res.status(404).json({ error: 'You do not own any futsal arenas' });
//     }

//     const arenaIds = futsals.map((futsal) => futsal._id);
//     const payments = await Payment.find({ futsalArena: { $in: arenaIds } })
//       .populate('userId', 'FirstName LastName')
//       .populate('bookingId', 'bookingDate startTime endTime status')
//       .select('userId bookingId amount paymentStatus transactionId paymentIdx paymentDate createdAt bookingDate startTime endTime futsalArena');

//     res.status(200).json(payments);
//   } catch (err) {
//     console.error('Error fetching payments:', err.message);
//     res.status(500).json({ error: 'Failed to fetch payments' });
//   }
// };

const getPaymentsForArena = async (req, res) => {
  try {
    const user = req.user;
    const {
      search = '', // Single search term
      sortBy = 'paymentDate',
      sortOrder = 'desc',
      page = 1,
      limit = 5
    } = req.query;

    // Find futsal arenas owned by user
    const futsals = await Futsal.find({ createdBy: user._id }).select('_id');
    if (!futsals || futsals.length === 0) {
      return res.status(404).json({ error: 'You do not own any futsal arenas' });
    }

    const arenaIds = futsals.map((futsal) => futsal._id);

    // Build query
    let query = {
      futsalArena: { $in: arenaIds }
    };

    // Build user query for username search
    let userIds = null;
    if (search) {
      // Search for users by FirstName or LastName
      const userQuery = {
        $or: [
          { FirstName: { $regex: search, $options: 'i' } },
          { LastName: { $regex: search, $options: 'i' } }
        ]
      };
      const users = await User.find(userQuery).select('_id');
      userIds = users.map(user => user._id);

      // Combine all search conditions
      query.$or = [
        { transactionId: { $regex: search, $options: 'i' } },
        { paymentIdx: { $regex: search, $options: 'i' } },
        ...(userIds.length > 0 ? [{ userId: { $in: userIds } }] : [])
      ];
    }

    // Build sort object
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get total count for pagination
    const totalPayments = await Payment.countDocuments(query);

    // Fetch payments with pagination
    const payments = await Payment.find(query)
      .populate('userId', 'FirstName LastName')
      .populate('bookingId', 'bookingDate startTime endTime status')
      .select('userId bookingId amount paymentStatus transactionId paymentIdx paymentDate createdAt bookingDate startTime endTime futsalArena')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      payments,
      pagination: {
        totalPayments,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalPayments / limit),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Error fetching payments:', err.message);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};
// const getAllPaymentsForAdmin = async (req, res) => {
//   try {
//     console.log('Admin payments route hit');

//     const payments = await Payment.find({ paymentStatus: 'completed' })
//       .populate('userId', 'FirstName LastName Email')
//       .populate('bookingId', 'bookingDate startTime endTime status')
//       .populate('futsalArena', 'name location')
//       .select('userId bookingId amount paymentStatus transactionId paymentDate paymentIdx futsalArena');

//     console.log('Payments fetched:', payments.length);

//     res.status(200).json(payments);
//   } catch (err) {
//     console.error(' Error fetching admin payments:', err.message);
//     res.status(500).json({ error: 'Failed to fetch payments for admin' });
//   }
// };

const getAllPaymentsForAdmin = async (req, res) => {
  try {
    console.log('Admin payments route hit');

    const {
      search = '',
      sortBy = 'paymentDate',
      sortOrder = 'desc',
      page = 1,
      limit = 5,
    } = req.query;

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    // Initial query: completed payments only
    let query = { paymentStatus: 'completed' };

    let userIds = null;

    if (search) {
      // Find users matching name
      const userQuery = {
        $or: [
          { FirstName: { $regex: search, $options: 'i' } },
          { LastName: { $regex: search, $options: 'i' } },
        ],
      };
      const users = await User.find(userQuery).select('_id');
      userIds = users.map((user) => user._id);

      query.$or = [
        { transactionId: { $regex: search, $options: 'i' } },
        { paymentIdx: { $regex: search, $options: 'i' } },
        ...(userIds.length > 0 ? [{ userId: { $in: userIds } }] : []),
      ];
    }

    // Sort setup
    const validSortFields = ['paymentDate', 'amount'];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'paymentDate';
    const sortOptions = {};
    sortOptions[finalSortBy] = sortOrder === 'asc' ? 1 : -1;

    // Total count
    const totalPayments = await Payment.countDocuments(query);

    // Fetch paginated & sorted payments
    const payments = await Payment.find(query)
      .populate('userId', 'FirstName LastName Email')
      .populate('bookingId', 'bookingDate startTime endTime status')
      .populate('futsalArena', 'name location')
      .select('userId bookingId amount paymentStatus transactionId paymentDate paymentIdx futsalArena')
      .sort(sortOptions)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    console.log('Payments fetched:', payments.length);

    res.status(200).json({
      payments,
      pagination: {
        totalPayments,
        currentPage: parsedPage,
        totalPages: Math.ceil(totalPayments / parsedLimit),
        limit: parsedLimit,
      },
    });
  } catch (err) {
    console.error('Error fetching admin payments:', err.message);
    res.status(500).json({ error: 'Failed to fetch payments for admin' });
  }
};


module.exports = {
  initiateKhaltiPayment,
  verifyKhaltiPayment,
  getPaymentsForArena,
  getAllPaymentsForAdmin
};
