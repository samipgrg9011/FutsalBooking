// routes/userRoutes.js
const express = require("express");
const { checkAuthorization } = require("../middleware/auth"); // Import your middleware
const { uploadUserProfileImage, updateUserProfile, getUserProfile} = require("../controller/profile"); // Import controller methods
const router = express.Router();

router.get("/api/profile", checkAuthorization, getUserProfile);
router.post("/api/profile/image", checkAuthorization, uploadUserProfileImage);
router.put("/api/update/profile", checkAuthorization, updateUserProfile);
module.exports = router;
