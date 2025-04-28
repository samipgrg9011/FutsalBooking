const express = require("express");
const { checkAuthorization, isOwner, isAdmin } = require("../middleware/auth");
const router = express.Router();

const { createReview, getFutsalReviews, getReviewsForOwner, getAllReviewsForAdmin } = require("../controller/review");
router.post("/api/create/futsal/:id/review", checkAuthorization, createReview);
router.get("/api/futsal/:id/reviews", getFutsalReviews);

// Routes for reviews
router.get("/api/owner/reviews", checkAuthorization, isOwner, getReviewsForOwner);

router.get("/api/admin/reviews", checkAuthorization, isAdmin, getAllReviewsForAdmin);



module.exports = router;
