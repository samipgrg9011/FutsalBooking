// // khaltiConfig.js
// const axios = require("axios");
// const Payment = require("../model/payment")
// const Booking = require("../model/booking")


// const KhaltiURL = process.env.KHALTI_URL;
// const khaltiSecretKey = process.env.KHALTI_SECRET_KEY;

// const initiateKhaltiPayment = async ({ bookingId, totalPrice, user }) => {
//   try {

//     console.log(khaltiSecretKey);
    
//     const paymentData = {
//       return_url: "http://localhost:8000/api/payment/callback",
//       website_url:  "http://localhost:5173/",
//       amount: totalPrice * 100, // Amount in paisa
//       purchase_order_id: bookingId,
//       purchase_order_name: "Futsal Booking",
//       customer_info: {
//         name: user.FirstName || "Guest",
//         email: user.Email || "guest@example.com",
//         phone: user.phone || "9800000000",
//       },
//     };

//     const response = await axios.post(`https://dev.khalti.com/api/v2/epayment/initiate/`, paymentData, {
//       headers: {
//         Authorization: `Key ${khaltiSecretKey}`,
//         "Content-Type": "application/json",
//       },
//     });

//     const { pidx, payment_url } = response.data;
//     return { paymentUrl: payment_url, pidx };
//   } catch (err) {
//     console.error(
//       "Payment initiation error:",
//       err.response ? err.response.data : err.message
//     );
//     throw new Error(`Payment initiation failed: ${err.message}`);
//   }
// };

// const verifyKhaltiPayment = async (req, res) => {
//   try {
//     const { pidx, transaction_id, amount, purchase_order_id } = req.query;
//     const verifyResponse = await axios.post(
//       `${KhaltiURL}/lookup/`,
//       { pidx },
//       {
//         headers: {
//           Authorization: `Key ${khaltiSecretKey}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const paymentStatus = verifyResponse.data.status;

//     if (paymentStatus === "Completed") {
//       // Update Payment
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

//       // Update Booking status to "confirmed"
//       const booking = await Booking.findByIdAndUpdate(
//         purchase_order_id,
//         {
//           status: "completed",
//           updatedAt: new Date(),
//         },
//         { new: true }
//       );

//       if (!booking) {
//         return res.status(404).json({ error: "Booking record not found." });
//       }

//       res.redirect("http://localhost:5173/booking/success");
//     } else {
//       // Update Payment
//       await Payment.findOneAndUpdate(
//         { bookingId: purchase_order_id },
//         { paymentStatus: "failed" }
//       );

//       // Update Booking status to "pending"
//       await Booking.findByIdAndUpdate(
//         purchase_order_id,
//         {
//           status: "pending", // Change to "cancelled" if preferred
//           updatedAt: new Date(),
//         }
//       );

//       res.redirect("http://localhost:5173/booking/failure");
//     }
//   } catch (err) {
//     console.error("Error verifying payment:", err.message);
//     res
//       .status(500)
//       .json({ error: "Payment verification failed.", details: err.message });
//   }
// };



 


// module.exports = {
//   initiateKhaltiPayment,
//   verifyKhaltiPayment,
// };



const axios = require("axios");
const Payment = require("../model/payment");
const Booking = require("../model/booking");

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
        phone: user.phone || "9800000000",
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

//     if (!pidx) {
//       return res.status(400).json({ error: "pidx is missing" });
//     }

//     console.log("Verifying payment with pidx:", pidx); // Debugging line

//     const verifyResponse = await axios.post(
//       "https://dev.khalti.com/api/v2/epayment/lookup/", // Correct URL
//       { pidx },
//       {
//         headers: {
//           Authorization: `Key ${khaltiSecretKey}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const paymentStatus = verifyResponse.data.status;

//     if (paymentStatus === "Completed") {
//       // Payment is successful, create booking, and update payment status
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

//       const booking = new Booking({
//         user: payment.userId,
//         futsalArena: payment.futsalArena,
//         bookingDate: payment.bookingDate,
//         startTime: payment.startTime,
//         endTime: payment.endTime,
//         totalAmount: payment.amount,
//         status: "completed", // Mark the booking as completed            6
//         paymentId: payment._id, // Set the paymentId here
//       });

//       await booking.save();

//       // Update payment with bookingId
//       await Payment.findByIdAndUpdate(payment._id, { bookingId: booking._id });

//       res.redirect("http://localhost:5173/booking/success");
//     } else {
//       console.log("Payment was canceled or failed for purchase_order_id:", purchase_order_id);

//     }
//   } catch (err) {
//     console.error("Error verifying payment:", err.message);
//     res.status(500).json({
//       error: "Payment verification failed.",
//       details: err.message,
//     });
//   }
// };

// const verifyKhaltiPayment = async (req, res) => {
//   try {
//     const { pidx, transaction_id, amount, purchase_order_id } = req.query;

//     const verifyResponse = await axios.post(
//       `${KhaltiURL}/lookup/`,
//       { pidx },
//       {
//         headers: {
//           Authorization: `Key ${khaltiSecretKey}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

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

//       res.redirect("http://localhost:5173/booking/success");
      
//     } else if (paymentStatus === "User canceled") {
//       // If payment is canceled by user, delete payment and booking records
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
//     console.error("Error verifying payment:", err.message);
//     res.status(500).json({
//       error: "Payment verification failed.",
//       details: err.message,
//     });
//   }
// };
const verifyKhaltiPayment = async (req, res) => {
  try {
    const { pidx, transaction_id, amount, purchase_order_id } = req.query;

    // Log the full URL for debugging
    const verificationUrl = `https://dev.khalti.com/api/v2/epayment/lookup/`;
    console.log(`Verifying payment using URL: ${verificationUrl}`);

    // Send a POST request to the Khalti verification endpoint
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

    // Log the response data to debug
    console.log("Khalti response data:", verifyResponse.data);

    // Check if the payment status is "Completed"
    const paymentStatus = verifyResponse.data.status;

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
        return res.status(404).json({ error: "Payment record not found." });
      }
      res.status(200).json({status :"success"})
      
    } else if (paymentStatus === "User canceled") {
      // If payment is canceled by the user, delete payment and booking records
      const payment = await Payment.findOne({ bookingId: purchase_order_id });
      const booking = await Booking.findOne({ _id: purchase_order_id });

      if (payment && booking) {
        // Delete payment and booking records
        await Payment.deleteOne({ bookingId: purchase_order_id });
        await Booking.deleteOne({ _id: purchase_order_id });

        console.log(
          `Payment and booking deleted for bookingId: ${purchase_order_id} due to user cancellation`
        );
      }

      res.redirect("http://localhost:5173/booking/failure");

    } else {
      // If payment fails, delete payment and booking records
      const payment = await Payment.findOne({ bookingId: purchase_order_id });
      const booking = await Booking.findOne({ _id: purchase_order_id });

      if (payment && booking) {
        // Delete payment and booking records
        await Payment.deleteOne({ bookingId: purchase_order_id });
        await Booking.deleteOne({ _id: purchase_order_id });

        console.log(
          `Payment and booking deleted for bookingId: ${purchase_order_id} due to payment failure`
        );
      }

      res.redirect("http://localhost:5173/booking/failure");
    }
  } catch (err) {
    // Log the error details for better debugging
    console.error("Error verifying payment:", err.message);

    // Handle 404 error specifically for missing Khalti endpoint
    if (err.response && err.response.status === 404) {
      return res.status(404).json({
        error: "Payment verification failed. Khalti endpoint not found.",
        details: err.message,
      });
    }

    // Handle other errors
    res.status(500).json({
      error: "Payment verification failed.",
      details: err.message,
    });
  }
};



module.exports = {
  initiateKhaltiPayment,
  verifyKhaltiPayment,
};
