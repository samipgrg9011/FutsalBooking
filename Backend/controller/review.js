const Review = require("../model/review");
const Futsal = require("../model/Futsal")
const User = require("../model/User")
const Booking = require("../model/booking")


// Create a review
// const createReview = async (req, res) => {
//     try {
//       const { comment, rating } = req.body;
//       const futsalId = req.params.id;

//       // Check if futsal exists
//       const futsal = await Futsal.findById(futsalId);
//       if (!futsal) {
//         return res.status(404).json({ message: "Futsal not found" });
//       }

//       // Create review
//       const review = new Review({
//         comment,
//         rating,
//         futsal: futsalId,
//         user: req.user._id, // Assuming user ID comes from auth middleware
//       });

//       await review.save();

//       await review.populate("user", "FirstName LastName");
//       res.status(201).json(review);
//     } catch (error) {
//       console.error(error);
//       res.status(400).json({ message: "Review creation failed", error: error.message });
//     }
//   };

const createReview = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const futsalId = req.params.id;
    const userId = req.user._id; // Assuming user ID from auth middleware

    // Validate futsal existence
    const futsal = await Futsal.findById(futsalId);
    if (!futsal) {
      return res.status(404).json({ message: "Futsal not found" });
    }

    // Validate rating
    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be an integer between 1 and 5",
      });
    }

    // Validate comment (if provided)
    if (comment && typeof comment !== "string") {
      return res.status(400).json({ message: "Comment must be a string" });
    }
    if (comment && comment.length > 500) {
      return res.status(400).json({
        message: "Comment cannot exceed 500 characters",
      });
    }

    // Check for completed booking
    const completedBooking = await Booking.findOne({
      user: userId,
      futsalArena: futsalId,
      status: "completed",
    });
    if (!completedBooking) {
      return res.status(403).json({
        message: "You can only review after completing a booking for this futsal",
      });
    }

    // Check for existing review
    const existingReview = await Review.findOne({
      user: userId,
      futsal: futsalId,
    });
    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this futsal",
      });
    }

    // Create review
    const review = new Review({
      comment: comment || undefined, // Ensure empty string is not saved
      rating,
      futsal: futsalId,
      user: userId,
    });

    await review.save();

    // Populate user details
    await review.populate("user", "FirstName LastName");

    // Optionally update futsal's average rating
    const reviews = await Review.find({ futsal: futsalId });
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Futsal.findByIdAndUpdate(futsalId, { averageRating });

    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(400).json({
      message: "Failed to create review",
      error: error.message,
    });
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

// const getReviewsForOwner = async (req, res) => {
//   try {
//     // Assuming you have the owner's ID from the authentication middleware
//     const ownerId = req.user._id; // Adjust this based on your auth setup

//     // Log the ownerId to ensure it's correct
//     console.log('Owner ID:', ownerId);

//     // First, find all futsals owned by this owner
//     const ownerFutsals = await Futsal.find({ createdBy: ownerId }).select('_id');

//     // Log the futsals associated with the owner
//     console.log('Owner Futsals:', ownerFutsals);

//     // Check if the owner has futsals
//     if (ownerFutsals.length === 0) {
//       return res.status(404).json({ message: 'No futsals found for this owner.' });
//     }

//     // Extract futsal IDs
//     const futsalIds = ownerFutsals.map(futsal => futsal._id);

//     // Fetch reviews for futsals owned by this owner
//     const reviews = await Review.find({ futsal: { $in: futsalIds } })
//       .populate("futsal", "name location")
//       .populate("user", "FirstName LastName")
//       .sort({ createdAt: -1 });

//     // Log the reviews to check the results
//     console.log('Reviews:', reviews);

//     // If no reviews found, return a response indicating so
//     if (reviews.length === 0) {
//       return res.status(404).json({ message: 'No reviews found for the futsals of this owner.' });
//     }

//     res.status(200).json({
//       totalReviews: reviews.length,
//       reviews,
//     });
//   } catch (error) {
//     console.error("Error fetching reviews for owner:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const getReviewsForOwner = async (req, res) => {
//   try {
//     const ownerId = req.user._id;
//     console.log('Owner ID:', ownerId);

//     const {
//       search = '',
//       sortBy = 'createdAt',
//       sortOrder = 'desc',
//       page = 1,
//       limit = 5,
//     } = req.query;

//     const parsedLimit = parseInt(limit);
//     const parsedPage = parseInt(page);

//     // Find all futsals owned by this owner
//     const ownerFutsals = await Futsal.find({ createdBy: ownerId }).select('_id');
//     console.log('Owner Futsals:', ownerFutsals);

//     if (ownerFutsals.length === 0) {
//       return res.status(404).json({ message: 'No futsals found for this owner.' });
//     }

//     const futsalIds = ownerFutsals.map((futsal) => futsal._id);

//     // Build query
//     let query = { futsal: { $in: futsalIds } };

//     let userIds = null;
//     if (search) {
//       // Search for users by FirstName or LastName
//       const userQuery = {
//         $or: [
//           { FirstName: { $regex: search, $options: 'i' } },
//           { LastName: { $regex: search, $options: 'i' } },
//         ],
//       };
//       const users = await User.find(userQuery).select('_id');
//       userIds = users.map((user) => user._id);

//       // Combine search conditions
//       query.$or = [
//         { comment: { $regex: search, $options: 'i' } },
//         ...(userIds.length > 0 ? [{ user: { $in: userIds } }] : []),
//       ];
//     }

//     // Sort setup
//     const validSortFields = ['createdAt', 'rating'];
//     const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
//     const sortOptions = {};
//     sortOptions[finalSortBy] = sortOrder === 'asc' ? 1 : -1;

//     // Total count for pagination
//     const totalReviews = await Review.countDocuments(query);

//     // Fetch reviews with pagination
//     const reviews = await Review.find(query)
//       .populate('futsal', 'name location')
//       .populate('user', 'FirstName LastName')
//       .select('futsal user comment rating createdAt')
//       .sort(sortOptions)
//       .skip((parsedPage - 1) * parsedLimit)
//       .limit(parsedLimit);

//     console.log('Reviews fetched:', reviews.length);

//     if (reviews.length === 0 && totalReviews === 0) {
//       return res.status(404).json({ message: 'No reviews found for the futsals of this owner.' });
//     }

//     res.status(200).json({
//       reviews,
//       pagination: {
//         totalReviews,
//         currentPage: parsedPage,
//         totalPages: Math.ceil(totalReviews / parsedLimit),
//         limit: parsedLimit,
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching reviews for owner:', error.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


const getReviewsForOwner = async (req, res) => {
  try {
    const ownerId = req.user._id;
    console.log('Owner ID:', ownerId);

    const {
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 5,
    } = req.query;

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    // Find all futsals owned by this owner
    const ownerFutsals = await Futsal.find({ createdBy: ownerId }).select('_id name');
    console.log('Owner Futsals:', ownerFutsals);

    if (ownerFutsals.length === 0) {
      return res.status(404).json({ message: 'No futsals found for this owner.' });
    }

    const futsalIds = ownerFutsals.map((futsal) => futsal._id);

    // Build query
    let query = { futsal: { $in: futsalIds } };

    if (search) {
      // Search for futsals by name
      const matchedFutsals = await Futsal.find({
        _id: { $in: futsalIds },
        name: { $regex: search, $options: 'i' },
      }).select('_id');

      const matchedFutsalIds = matchedFutsals.map((futsal) => futsal._id);

      if (matchedFutsalIds.length > 0) {
        query.futsal = { $in: matchedFutsalIds };
      } else {
        // If no futsals match search, return empty immediately
        return res.status(404).json({ message: 'No matching futsals found for the search term.' });
      }
    }

    // Sort setup
    const validSortFields = ['createdAt', 'rating'];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOptions = {};
    sortOptions[finalSortBy] = sortOrder === 'asc' ? 1 : -1;

    // Total count for pagination
    const totalReviews = await Review.countDocuments(query);

    // Fetch reviews with pagination
    const reviews = await Review.find(query)
      .populate('futsal', 'name location')
      .populate('user', 'FirstName LastName')
      .select('futsal user comment rating createdAt')
      .sort(sortOptions)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    console.log('Reviews fetched:', reviews.length);

    if (reviews.length === 0 && totalReviews === 0) {
      return res.status(404).json({ message: 'No reviews found for the futsals of this owner.' });
    }

    res.status(200).json({
      reviews,
      pagination: {
        totalReviews,
        currentPage: parsedPage,
        totalPages: Math.ceil(totalReviews / parsedLimit),
        limit: parsedLimit,
      },
    });
  } catch (error) {
    console.error('Error fetching reviews for owner:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};




// const getAllReviewsForAdmin = async (req, res) => {
//   try {
//     // Fetch all reviews and populate futsal name and user details
//     const reviews = await Review.find()
//       .populate("futsal", "name location")
//       .populate("user", "FirstName LastName")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       totalReviews: reviews.length,
//       reviews,
//     });
//   } catch (error) {
//     console.error("Error fetching all reviews for admin:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const getAllReviewsForAdmin = async (req, res) => {
  try {
    const {
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 5,
    } = req.query;

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    // Build query
    let query = {};

    let userIds = null;
    let futsalIds = null;
    if (search) {
      // Search for users by FirstName or LastName
      const userQuery = {
        $or: [
          { FirstName: { $regex: search, $options: 'i' } },
          { LastName: { $regex: search, $options: 'i' } },
        ],
      };
      const users = await User.find(userQuery).select('_id');
      userIds = users.map((user) => user._id);

      // Search for futsals by name
      const futsalQuery = {
        name: { $regex: search, $options: 'i' },
      };
      const futsals = await Futsal.find(futsalQuery).select('_id');
      futsalIds = futsals.map((futsal) => futsal._id);

      // Combine search conditions
      query.$or = [
        ...(futsalIds.length > 0 ? [{ futsal: { $in: futsalIds } }] : []),
        ...(userIds.length > 0 ? [{ user: { $in: userIds } }] : []),
      ];
    }

    // Sort setup
    const validSortFields = ['createdAt', 'rating'];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOptions = {};
    sortOptions[finalSortBy] = sortOrder === 'asc' ? 1 : -1;

    // Total count for pagination
    const totalReviews = await Review.countDocuments(query);

    // Fetch reviews with pagination
    const reviews = await Review.find(query)
      .populate('futsal', 'name location')
      .populate('user', 'FirstName LastName')
      .select('futsal user comment rating createdAt')
      .sort(sortOptions)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    console.log('Reviews fetched:', reviews.length);

    if (reviews.length === 0 && totalReviews === 0) {
      return res.status(404).json({ message: 'No reviews found.' });
    }

    res.status(200).json({
      reviews,
      pagination: {
        totalReviews,
        currentPage: parsedPage,
        totalPages: Math.ceil(totalReviews / parsedLimit),
        limit: parsedLimit,
      },
    });
  } catch (error) {
    console.error('Error fetching all reviews for admin:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createReview, getFutsalReviews, getReviewsForOwner, getAllReviewsForAdmin, }