
require('dotenv').config();

const express = require("express");
const app = express();
const handleServerError = require("./middleware/handleServerError.js");
require("./config/database.js");
const authRoutes = require("./routes/auth.js");

const bookingRoutes = require("./routes/booking.js");

const futsalRoutes = require("./routes/futsal.js")
const loggedUserRoutes = require("./routes/AdminPanel.js")

const PaymentRoutes = require("./routes/PaymentRoutes.js")

const profilesRoutes = require("./routes/profiles.js")

const ReviewRoutes = require("./routes/review.js")



const fileUpload = require("express-fileupload")
const cors = require("cors");


app.use(express.json());
app.use(cors());
app.use(fileUpload())
app.use(express.static('uploads'))//http://localhost:8000/mm.jpg yo dekhina ko lagi
// public path

app.use(authRoutes);
app.use(futsalRoutes);
app.use(bookingRoutes)
app.use(loggedUserRoutes);
app.use(PaymentRoutes) 
app.use(profilesRoutes);
app.use(ReviewRoutes);



app.use((req, res) => {
  res.status(404).send({ msg: "Resource not found" });
});
app.use(handleServerError);

app.listen(8000, () => {
  console.log("server started....");
});
