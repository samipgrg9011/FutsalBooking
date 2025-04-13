const express = require("express");
const { signup, login, becomeOwner } = require("../controller/auth");
const { checkAuthorization } = require("../middleware/auth");
const router = express.Router();

router.post("/api/signup", signup);
router.post("/api/login", login);
router.post("/api/become-owner", checkAuthorization, becomeOwner);


module.exports = router;
