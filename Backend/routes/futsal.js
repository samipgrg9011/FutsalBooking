const express = require("express");
const {
  storeFutsal,
  getFutsals,
  deleteFutsal,
  updateFutsal,
  getSingleFutsal,
  getOwnerFutsals,
} = require("../controller/futsal");
const { checkAuthorization, isOwner, isAdmin } = require("../middleware/auth");
const { 
  // addOwner,
  // deleteOwner,
  // getAllOwners
  getAllFutsalsForAdmin,
  deleteFutsalByAdmin
} = require("../controller/adminManage")
const router = express.Router();

// CRUD Operations for Futsals
router.get("/api/futsal", getFutsals); // Public route to view all futsals
router.get("/api/futsal/:id", getSingleFutsal); // Public route to view a single futsal
router.get("/api/futsals/owner", checkAuthorization, getOwnerFutsals)

//for Owner
router.post("/api/owner/futsal", checkAuthorization, isOwner, storeFutsal); 
router.delete("/api/owner/futsal/:id", checkAuthorization, isOwner, deleteFutsal); 
router.put("/api/owner/futsal/:id", checkAuthorization, isOwner, updateFutsal); 




// // Admin-specific routes for futsals
// router.post("/api/admin/futsals", checkAuthorization, isAdmin, storeFutsal); // Admin can create futsal
// router.put("/api/admin/futsals/:id", checkAuthorization, isAdmin, updateFutsal); // Admin can update futsal
// router.delete("/api/admin/futsals/:id", checkAuthorization, isAdmin, deleteFutsal); // Admin can delete futsal
// router.get("/api/owners", checkAuthorization, isAdmin, getAllOwners); 
// router.delete("/api/owners/:id", checkAuthorization, isAdmin, deleteOwner); 
// router.post('/api/admin/owner', checkAuthorization, isAdmin, addOwner);

router.get("/api/futsals", checkAuthorization, isAdmin, getAllFutsalsForAdmin)
router.delete("/api/futsals/:futsalId", checkAuthorization, isAdmin, deleteFutsalByAdmin)


module.exports = router;
