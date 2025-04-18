import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/reviews', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Use the reviews array from response.data
      setReviews(response.data.reviews);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching reviews:', err.message);
      setError('Error fetching reviews');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading) {
    return <div className="text-center text-teal-400 font-semibold">Loading...</div>;
  }

  return (
    <div className="ml-auto p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Manage Reviews</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Reviews Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-teal-500 text-white">
            <tr>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Futsal</th>
              <th className="py-3 px-4 text-left">Location</th>
              <th className="py-3 px-4 text-left">Comment</th>
              <th className="py-3 px-4 text-left">Rating</th>
              <th className="py-3 px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-3 px-4 text-center text-gray-500">
                  No reviews found
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review._id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {review.user?.FirstName} {review.user?.LastName}
                  </td>
                  <td className="py-3 px-4">
                    {review.futsal?.name || 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    {review.futsal?.location || 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    {review.comment || 'No comment'}
                  </td>
                  <td className="py-3 px-4">
                    {review.rating || 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reviews;
