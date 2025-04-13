
const express = require("express");
const { checkAuthorization } = require("../middleware/auth");
const router = express.Router();

const { createReview, getFutsalReviews } = require("../controller/review");
router.post("/api/create/futsal/:id/review", checkAuthorization, createReview);
router.get("/api/futsal/:id/reviews", getFutsalReviews);


module.exports = router;
