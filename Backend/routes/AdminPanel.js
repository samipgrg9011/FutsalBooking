const express = require("express");
const { checkAuthorization, isAdmin } = require("../middleware/auth");
const { getAllUserForAdmin } = require("../controller/adminManage");

const router = express.Router();



router.get("/api/admin/allusers",  checkAuthorization, isAdmin, getAllUserForAdmin);


module.exports = router;
