const express = require("express");
const { verifyKhaltiPayment, getPaymentsForArena, getAllPaymentsForAdmin } = require("../controller/PaymentController");
const { checkAuthorization, isOwner, isAdmin } = require("../middleware/auth");


const router = express.Router();


router.get("/api/payment/callback", verifyKhaltiPayment)

router.get("/api/owner/payment/arena", checkAuthorization, isOwner,  getPaymentsForArena);

router.get("/api/admin/payment/arena", checkAuthorization, isAdmin, getAllPaymentsForAdmin);


module.exports = router;
