const express = require("express");

const { checkAuthorization, isOwner } = require("../middleware/auth");
const router = express.Router();
const {makeBooking, getBookings, getAvailableSlots, getAllBookingsOfUsers, deleteBooking} = require("../controller/booking")

router.post("/api/book/:id", checkAuthorization, makeBooking);

router.get("/api/booking", checkAuthorization, getBookings)
// router.post('/api/available-slots',  getAvailableSlots);
router.get('/api/available-slots', getAvailableSlots);

router.get("/api/owner/bookings",  checkAuthorization, isOwner, getAllBookingsOfUsers);

router.delete("/api/bookings/:id",  checkAuthorization, isOwner, deleteBooking);








module.exports = router;
