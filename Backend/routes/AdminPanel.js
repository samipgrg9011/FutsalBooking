const express = require("express");
const { checkAuthorization, isAdmin } = require("../middleware/auth");
const { getLoggedInUsers } = require("../controller/adminManage");

const router = express.Router();



router.get("/api/logged-in-users",  checkAuthorization, isAdmin, getLoggedInUsers);









module.exports = router;
