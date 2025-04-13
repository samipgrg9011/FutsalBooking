const express = require("express");
const { verifyKhaltiPayment } = require("../controller/PaymentController");

const router = express.Router();


router.get("/api/payment/callback", verifyKhaltiPayment)

module.exports = router;
