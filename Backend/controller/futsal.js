const Futsal = require("../model/Futsal");
const path = require("path");
const mongoose = require("mongoose");
const Review = require("../model/review"); // Adjust path to your Review model



const getFutsals = async (req, res, next) => {
  console.log(req.query);
  let searchTerm = req.query.searchTerm || "";
  let location = req.query.location || "";
  let sortByPrice = req.query.sortByPrice || "asc";
  let priceFrom = parseFloat(req.query.priceFrom) || 0;
  let priceTo = parseFloat(req.query.priceTo) || Number.MAX_VALUE;

  let sortOrder = sortByPrice === "desc" ? -1 : 1;

  try {
    let filterOptions = {
      $and: [
        { name: new RegExp(searchTerm, "i") },
        { pricePerHour: { $gte: priceFrom, $lte: priceTo } },
      ],
    };

    if (location) {
      filterOptions.$and.push({ location: new RegExp(location, "i") });
    }

    let futsals = await Futsal.find(filterOptions)
      .populate("createdBy", "name Email, PhoneNumber")
      .sort({ pricePerHour: sortOrder })
      .lean(); // Use .lean() for plain JS objects

    // Add avgRating and reviewCount for each futsal
    for (let futsal of futsals) {
      const reviews = await Review.find({ futsal: futsal._id });

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = reviews.length > 0 ? Number((totalRating / reviews.length).toFixed(1)) : "No ratings";

      futsal.avgRating = avgRating;
      futsal.reviewCount = reviews.length;
    }

    res.status(200).send({ total: futsals.length, futsals });
  } catch (err) {
    next(err);
  }
};


// const getSingleFutsal = async (req, res) => {
//   try {
//     // Fetch the futsal by ID
//     let futsal = await Futsal.findById(req.params.id);
    
//     if (!futsal) {
//       return res.status(404).json({ message: "Futsal not found" });
//     }

//     // Fetch all reviews for this futsal
//     const reviews = await Review.find({ futsal: req.params.id });

//     // Calculate average rating
//     let avgRating = null;
//     if (reviews.length > 0) {
//       const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
//       avgRating = Number((totalRating / reviews.length).toFixed(1)); // Round to 1 decimal place
//     }

//     // Convert futsal to plain object and add avgRating
//     futsal = futsal.toObject(); // Convert Mongoose document to plain JS object
//     futsal.avgRating = avgRating || "No ratings"; // Add avgRating to response
//     futsal.reviewCount = reviews.length; // Optionally add review count

//     // Send response
//     res.status(200).json(futsal);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// Store a New Futsal with Multiple Images

const getSingleFutsal = async (req, res) => {
  try {
    // Fetch the futsal by ID and populate createdBy with name, email, and phoneNumber
    let futsal = await Futsal.findById(req.params.id)
      .populate("createdBy", "name Email phoneNumber"); // Populate owner details

    if (!futsal) {
      return res.status(404).json({ message: "Futsal not found" });
    }

    // Fetch all reviews for this futsal
    const reviews = await Review.find({ futsal: req.params.id });

    // Calculate average rating
    let avgRating = null;
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      avgRating = Number((totalRating / reviews.length).toFixed(1)); // Round to 1 decimal place
    }

    // Convert futsal to plain object and add avgRating
    futsal = futsal.toObject(); // Convert Mongoose document to plain JS object
    futsal.avgRating = avgRating || "No ratings"; // Add avgRating to response
    futsal.reviewCount = reviews.length; // Optionally add review count

    // Send response
    res.status(200).json(futsal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const storeFutsal = async (req, res, next) => {
  try {
      if (!req.files || !req.files.images) {
          return res.status(400).send({ msg: "At least 5 images are required." });
      }

      let images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      if (images.length < 5) {
          return res.status(400).send({ msg: "Please upload at least 5 images." });
      }

      let imagePaths = [];
      for (let image of images) {
          let destination = path.join(path.resolve(), "uploads", image.name);
          await image.mv(destination);
          imagePaths.push(image.name);
      }

      let futsal = await Futsal.create({
          ...req.body,
          createdBy: req.user._id,
          images: imagePaths,
      });

      res.status(201).send(futsal);
  } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Internal Server Error", error: error.message });
  }
};

const updateFutsal = async (req, res, next) => {
  try {
      let futsal = await Futsal.findById(req.params.id);
      if (!futsal) {
          return res.status(404).send({ msg: "Futsal not found" });
      }
      if (req.user._id.toString() !== futsal.createdBy.toString()) {
          return res.status(403).send({ msg: "Permission denied" });
      }

      let updatedFields = { ...req.body };
      let imagePaths = [...futsal.images]; // Start with existing images

      // Handle deleted images
      if (req.body.deletedImages) {
          const deletedImages = JSON.parse(req.body.deletedImages);
          imagePaths = imagePaths.filter((img) => !deletedImages.includes(img));
      }

      // Handle new images
      if (req.files && req.files.images) {
          let images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
          for (let image of images) {
              let destination = path.join(path.resolve(), "uploads", image.name);
              await image.mv(destination);
              imagePaths.push(image.name);
          }
      }

      if (imagePaths.length < 5) {
          return res.status(400).send({ msg: "At least 5 images are required." });
      }

      updatedFields.images = imagePaths;

      let updatedFutsal = await Futsal.findByIdAndUpdate(req.params.id, updatedFields, {
          new: true,
          runValidators: true,
      });

      res.status(200).send({ msg: "Futsal updated", updatedFutsal });
  } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Internal Server Error", error: error.message });
  }
};
// Delete Futsal
const deleteFutsal = async (req, res, next) => {
  try {
    let futsal = await Futsal.findById(req.params.id);

    if (!futsal) {
      return res.status(404).send({ msg: "Futsal not found" });
    }

    if (req.user._id.toString() !== futsal.createdBy.toString()) {
      return res.status(403).send({ msg: "Permission denied" });
    }

    await Futsal.findByIdAndDelete(req.params.id);

    res.status(200).send({ msg: "Futsal deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Internal Server Error", error: err.message });
  }
};

const getOwnerFutsals = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user data found" });
    }

    const ownerId = req.user._id; // Extract the owner ID from the token
    console.log("Owner ID:", ownerId);

    if (!ownerId) {
      return res.status(400).json({ message: "Owner ID is required" });
    }

    // Query using createdBy instead of owner
    const futsals = await Futsal.find({ createdBy: new mongoose.Types.ObjectId(ownerId) })
      .populate("location", "address city")
      .exec();

    if (!futsals || futsals.length === 0) {
      return res.status(404).json({ message: "No futsal arenas found for this owner" });
    }

    res.status(200).json({ success: true, futsals });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};





module.exports = {
  getFutsals,
  storeFutsal,
  updateFutsal,
  deleteFutsal,
  getSingleFutsal,
  getOwnerFutsals
};
