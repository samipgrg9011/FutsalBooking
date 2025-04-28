const express = require("express");

const { checkAuthorization, isOwner, isAdmin } = require("../middleware/auth");
const router = express.Router();
const {makeBooking, getBookings, getAvailableSlots, getAllBookingsOfUsers, deleteBooking, getAllBookingsForAdmin, cancelBooking} = require("../controller/booking")

router.post("/api/book/:id", checkAuthorization, makeBooking);

router.get("/api/booking", checkAuthorization, getBookings)
// router.post('/api/available-slots',  getAvailableSlots);
router.get('/api/available-slots', getAvailableSlots);

router.get("/api/owner/bookings",  checkAuthorization, isOwner, getAllBookingsOfUsers);

router.get("/api/admin/bookings",  checkAuthorization, isAdmin, getAllBookingsForAdmin);


router.delete("/api/bookings/:id",  checkAuthorization, isAdmin, deleteBooking);
router.patch("/api/booking/cancel/:id", checkAuthorization, cancelBooking);








module.exports = router;
