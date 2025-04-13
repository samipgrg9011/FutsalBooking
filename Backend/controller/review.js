const Review = require("../model/review");
const Futsal = require("../model/Futsal")

// Create a review
const createReview = async (req, res) => {
    try {
      const { comment, rating } = req.body;
      const futsalId = req.params.id;
  
      // Check if futsal exists
      const futsal = await Futsal.findById(futsalId);
      if (!futsal) {
        return res.status(404).json({ message: "Futsal not found" });
      }
  
      // Create review
      const review = new Review({
        comment,
        rating,
        futsal: futsalId,
        user: req.user._id, // Assuming user ID comes from auth middleware
      });
  
      await review.save();

      await review.populate("user", "FirstName LastName");
      res.status(201).json(review);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Review creation failed", error: error.message });
    }
  };
  
  // Get all reviews for a futsal
  const getFutsalReviews = async (req, res) => {
    try {
      const reviews = await Review.find({ futsal: req.params.id }).populate("user", "FirstName LastName");
      res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

module.exports = {createReview, getFutsalReviews}