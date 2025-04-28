// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ArenaReview = () => {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchReviews = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setError("No token found. Please log in.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.get('http://localhost:8000/api/owner/reviews', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setReviews(response.data.reviews);
//       setLoading(false);
//     } catch (err) {
//       console.error('Error fetching reviews:', err.response ? err.response.data : err.message);
//       setError('Error fetching reviews');
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReviews();
//   }, []);

//   if (loading) {
//     return <div className="text-center text-teal-400 font-semibold">Loading...</div>;
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-8">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">My Futsal Reviews</h2>
  

//       {reviews.length === 0 ? (
//         <div className="text-center py-10 text-gray-500">
//           No reviews found
//         </div>
//       ) : (
//         <div className="overflow-x-auto shadow-md rounded-lg">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Futsal</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {reviews.map((review) => (
//                 <tr key={review._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">
//                       {review.user ? `${review.user.FirstName} ${review.user.LastName}` : "N/A"}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {review.futsal?.name || "N/A"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {review.futsal?.location || "N/A"}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-500">
//                     {review.comment || "No comment"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {review.rating || "N/A"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(review.createdAt).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };
// export default ArenaReview;


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ArenaReview = () => {
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({
    totalReviews: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 5,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [page, setPage] = useState(1);

  const fetchReviews = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/owner/reviews', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search,
          ...sort,
          page,
          limit: pagination.limit,
        },
      });

      setReviews(response.data.reviews);
      setPagination(response.data.pagination);
      setLoading(false);
      // Clear error if reviews are found or no search was performed
      setError(response.data.reviews.length === 0 && search ? 'No reviews found for your search.' : null);
    } catch (err) {
      console.error('Error fetching reviews:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Error fetching reviews');
      setLoading(false);
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchReviews();
  };

  const handleSortFieldChange = (e) => {
    setSort({ ...sort, sortBy: e.target.value });
  };

  const handleSortOrderChange = (e) => {
    setSort({ ...sort, sortOrder: e.target.value });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-teal-400 font-semibold">Loading...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Futsal Reviews</h2>

      {/* Search and Sort Controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <form onSubmit={handleSearch} className="flex-grow">
          <div className="flex gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by futsal name"
              className="px-4 py-2 border rounded-md flex-grow"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </form>
        <div className="flex gap-4">
          <select
            value={sort.sortBy}
            onChange={handleSortFieldChange}
            className="px-4 py-2 border rounded-md"
          >
            <option value="createdAt">Date</option>
            <option value="rating">Rating</option>
          </select>
          <select
            value={sort.sortOrder}
            onChange={handleSortOrderChange}
            className="px-4 py-2 border rounded-md"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {(error || reviews.length === 0) && (
        <div className="text-center py-10 text-red-500">
          {error || 'No reviews found'}
        </div>
      )}

      {/* Table and Pagination (only shown if reviews exist) */}
      {reviews.length > 0 && (
        <>
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Futsal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {review.user ? `${review.user.FirstName} ${review.user.LastName}` : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {review.futsal?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {review.futsal?.location || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {review.comment || 'No comment'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {review.rating || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Showing {reviews.length} of {pagination.totalReviews} reviews
            </div>
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ArenaReview;