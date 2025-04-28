// // Review.jsx
// import React, { useEffect } from "react";
// import { FaStar } from "react-icons/fa";
// import axios from "axios";
// import {toast, ToastContainer} from 'react-toastify';

// const Review = ({ reviews, setReviews, futsalId, setError, onReviewAdded }) => {
//   const [newComment, setNewComment] = React.useState("");
//   const [newRating, setNewRating] = React.useState("");

//   // Fetch reviews for the futsal whenever futsalId changes
//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8000/api/futsal/${futsalId}/reviews`);
//         setReviews(response.data);
//       } catch (error) {
//         console.error("Error fetching reviews:", error);
//         setError("Failed to load reviews.");
//       }
//     };

//     if (futsalId) {
//       fetchReviews();
//     }
//   }, [futsalId, setReviews, setError]);

//   // Handle review submission
//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("Please log in to submit a review.");
        
//         return;
//       }

//       const response = await axios.post(
//         `http://localhost:8000/api/create/futsal/${futsalId}/review`,
//         { comment: newComment, rating: newRating },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.status === 201) {
//         setNewComment("");
//         setNewRating(1);
//         setError("");
//         // Refetch reviews to update the review list
//         const updatedReviews = await axios.get(`http://localhost:8000/api/futsal/${futsalId}/reviews`);
//         setReviews(updatedReviews.data);
//         // Call the callback to update futsal data in parent component
//         onReviewAdded(); // Trigger refetch of futsal data
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       setError(error.response?.data?.message || "Failed to submit review. Please try again.");
//     }
//   };

//   return (
//     <div>
//       {/* Reviews Section */}
//       <div className="border-t pt-6">
//         <ToastContainer/>
//         <h4 className="text-lg font-semibold text-gray-800 mb-4">Reviews</h4>
//         {reviews.length > 0 ? (
//           <div className="space-y-4">
//             {reviews.map((review) => (
//               <div key={review._id} className="border rounded-lg p-4 bg-gray-50">
//                 <div className="flex items-center gap-2 mb-2">
//                   <FaStar className="text-yellow-400" />
//                   <span className="text-gray-700 font-medium">{review.rating} / 5</span>
//                 </div>
//                 <p className="text-gray-600 text-sm">{review.comment}</p>
//                 <p className="text-gray-500 text-xs mt-2">
//                   {review.user?.FirstName && review.user?.LastName
//                     ? `${review.user.FirstName} ${review.user.LastName}`
//                     : "Anonymous"}{" "}
//                   - {new Date(review.createdAt).toLocaleDateString()}
//                 </p>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-600 text-sm">No reviews yet. Be the first to review!</p>
//         )}
//       </div>

//       {/* Review Form Section */}
//       <div className="border-t pt-6 mt-6">
//         <h4 className="text-lg font-semibold text-gray-800 mb-4">Leave a Review</h4>
//         <form onSubmit={handleReviewSubmit} className="space-y-4">
//           <textarea
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             placeholder="Write your review here..."
//             className="w-full p-3 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             rows="4"
//             required
//           />
//           <div className="flex items-center gap-3">
//             <span className="text-gray-700 font-medium">Rating:</span>
//             {[1, 2, 3, 4, 5].map((star) => (
//               <FaStar
//                 key={star}
//                 className={`cursor-pointer ${star <= newRating ? "text-yellow-400" : "text-gray-300"}`}
//                 onClick={() => setNewRating(star)}
//               />
//             ))}
//           </div>
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 w-full sm:w-auto"
//           >
//             Submit Review
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Review;
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Review = ({ reviews, setReviews, futsalId, setError, onReviewAdded }) => {
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(null); // Null for no selection
  const [commentError, setCommentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch reviews for the futsal whenever futsalId changes
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/futsal/${futsalId}/reviews`);
        setReviews(response.data);
        setError("");
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews.");
        toast.error("Failed to load reviews.");
      }
    };

    if (futsalId) {
      fetchReviews();
    }
  }, [futsalId, setReviews, setError]);

  // Validate comment length
  const validateComment = (comment) => {
    if (comment.length > 500) {
      setCommentError("Comment cannot exceed 500 characters.");
      return false;
    }
    setCommentError("");
    return true;
  };

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to submit a review.");
        setIsSubmitting(false);
        return;
      }

      // Validate inputs
      if (!newRating) {
        toast.error("Please select a rating.");
        setIsSubmitting(false);
        return;
      }
      if (newComment && !validateComment(newComment)) {
        toast.error("Please fix the comment error.");
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/api/create/futsal/${futsalId}/review`,
        { comment: newComment || undefined, rating: newRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        setNewComment("");
        setNewRating(null); // Reset to no selection
        setCommentError("");
        setError("");
        toast.success("Review submitted successfully!");

        // Refetch reviews to update the review list
        const updatedReviews = await axios.get(`http://localhost:8000/api/futsal/${futsalId}/reviews`);
        setReviews(updatedReviews.data);

        // Call the callback to update futsal data in parent component
        onReviewAdded();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit review.";
      // setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      {/* Reviews Section */}
      <div className="border-t pt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Reviews</h4>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <FaStar className="text-yellow-400" />
                  <span className="text-gray-700 font-medium">{review.rating} / 5</span>
                </div>
                <p className="text-gray-600 text-sm">{review.comment || "No comment provided"}</p>
                <p className="text-gray-500 text-xs mt-2">
                  {review.user?.FirstName && review.user?.LastName
                    ? `${review.user.FirstName} ${review.user.LastName}`
                    : "Anonymous"}{" "}
                  - {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No reviews yet. Be the first to review!</p>
        )}
      </div>

      {/* Review Form Section */}
      <div className="border-t pt-6 mt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Leave a Review</h4>
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <textarea
              value={newComment}
              onChange={(e) => {
                setNewComment(e.target.value);
                validateComment(e.target.value);
              }}
              placeholder="Write your review here..."
              className={`w-full p-3 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                commentError ? "border-red-500" : ""
              }`}
              rows="4"
            />
            {commentError && <p className="text-red-500 text-sm mt-1">{commentError}</p>}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-700 font-medium">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer ${star <= newRating ? "text-yellow-400" : "text-gray-300"}`}
                onClick={() => setNewRating(star)}
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 w-full sm:w-auto ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Review;