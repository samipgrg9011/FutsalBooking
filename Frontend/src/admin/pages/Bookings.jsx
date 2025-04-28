// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaTrashAlt } from "react-icons/fa";

// const Bookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const [error, setError] = useState("");
//   const [pagination, setPagination] = useState({
//     // currentPage: 1,
//     // pageSize: 5,
//     // totalItems: 0,
//     // totalPages: 0,
//   });
//   const [sortConfig, setSortConfig] = useState({
//     sortBy: "bookingDate",
//     sortOrder: "desc",
//   });
//   const [search, setSearch] = useState("");

//   // Fetch bookings
//   const fetchBookings = async (page = 1) => {
//     try {
//       const response = await axios.get("http://localhost:8000/api/admin/bookings", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         params: {
//           page,
//           sortBy: sortConfig.sortBy,
//           sortOrder: sortConfig.sortOrder,
//           search: search.trim(), // Use search directly
//         },
//       });

//       setBookings(response.data.bookings || []);
//       setPagination(response.data.pagination);
//       setError(null);
//     } catch (err) {
//       console.error("Error fetching bookings:", err);
//       setError(err.response?.data?.message || "Failed to load bookings");
//     }
//   };

//   // Fetch bookings on sort, search, or page change
//   useEffect(() => {
//     fetchBookings(pagination.currentPage);
//   }, [sortConfig, search, pagination.currentPage]);

//   // Handle page change
//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.totalPages) {
//       setPagination((prev) => ({ ...prev, currentPage: newPage }));
//     }
//   };

//   // Handle sort change
//   const handleSortFieldChange = (e) => {
//     setSortConfig((prev) => ({
//       ...prev,
//       sortBy: e.target.value,
//     }));
//   };
  
//   const handleSortOrderChange = (e) => {
//     setSortConfig((prev) => ({
//       ...prev,
//       sortOrder: e.target.value,
//     }));
//   };
  

//   // Handle search input
//   const handleSearchChange = (e) => {
//     setSearch(e.target.value);
//     setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page on search
//   };

//   // Handle delete booking
//   const deleteBooking = async (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(`http://localhost:8000/api/bookings/${id}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       setBookings((prev) => prev.filter((booking) => booking._id !== id));
//       setPagination((prev) => ({
//         ...prev,
//         totalItems: prev.totalItems - 1,
//         totalPages: Math.ceil((prev.totalItems - 1) / prev.pageSize),
//       }));
//       alert("Booking deleted successfully");
//     } catch (err) {
//       console.error("Error deleting booking:", err);
//       alert("Failed to delete booking");
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-8">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">All Bookings</h2>
//       <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-6">
//         <div className="flex items-center space-x-2 mb-4 sm:mb-0">
//           <label htmlFor="search" className="text-sm font-medium text-gray-700">
//             Search Futsal:
//           </label>
//           <input
//             id="search"
//             type="text"
//             value={search}
//             onChange={handleSearchChange}
//             placeholder="Enter futsal name"
//             className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div className="flex items-center space-x-2">
//   <label htmlFor="sortField" className="text-sm font-medium text-gray-700">
//     Sort by:
//   </label>
//   <select
//     id="sortField"
//     onChange={handleSortFieldChange}
//     value={sortConfig.sortBy}
//     className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//   >
//     <option value="bookingDate">Booking Date</option>
 
//     {/* Add other sortable fields if needed */}
//   </select>

//   <select
//     id="sortOrder"
//     onChange={handleSortOrderChange}
//     value={sortConfig.sortOrder}
//     className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//   >
//     <option value="desc">Descending</option>
//     <option value="asc">Ascending</option>
//   </select>
// </div>

//       </div>
  
//       {error && (
//         <div className="text-center py-4 text-red-500">{error}</div>
//       )}
  
//       {!error && bookings.length === 0 && search.trim() !== "" ? (
//         <div className="text-center py-10 text-gray-500">No futsal found</div>
//       ) : !error && bookings.length === 0 ? (
//         <div className="text-center py-10 text-gray-500">No bookings found</div>
//       ) : (
//         !error && (
//           <>
//             <div className="overflow-x-auto shadow-md rounded-lg">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Booking ID
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Futsal Arena
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       User
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Booking Date
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Start Time
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       End Time
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Total Amount
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {bookings.map((booking) => (
//                     <tr key={booking._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking._id}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {booking.futsalArena ? booking.futsalArena.name : "N/A"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-500">
//                           {booking.user ? `${booking.user.FirstName} ${booking.user.LastName}` : "N/A"}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {new Date(booking.bookingDate).toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.startTime}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.endTime}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₨{booking.totalAmount}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         <button
//                           className="text-red-600 hover:text-red-800 p-2"
//                           onClick={() => deleteBooking(booking._id)}
//                         >
//                           <FaTrashAlt size={18} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
  
//             <div className="flex justify-between items-center mt-4">
//               <div className="text-sm text-gray-600">
//                 Showing {bookings.length} of {pagination.totalItems} bookings
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
//                   onClick={() => handlePageChange(pagination.currentPage - 1)}
//                   disabled={pagination.currentPage === 1}
//                 >
//                   Previous
//                 </button>
//                 <span className="px-4 py-2 text-gray-700">
//                   Page {pagination.currentPage} of {pagination.totalPages}
//                 </span>
//                 <button
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
//                   onClick={() => handlePageChange(pagination.currentPage + 1)}
//                   disabled={pagination.currentPage === pagination.totalPages}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </>
//         )
//       )}
//     </div>
//   );
// };

// export default Bookings;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt } from 'react-icons/fa';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({
    totalBookings: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 5,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({
    sortBy: 'bookingDate',
    sortOrder: 'desc',
  });
  const [page, setPage] = useState(1);

  const fetchBookings = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/admin/bookings', {
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

      setBookings(response.data.bookings || []);
      setPagination(response.data.pagination);
      setLoading(false);
      setError(response.data.bookings.length === 0 && search ? 'No bookings found for your search.' : null);
    } catch (err) {
      console.error('Error fetching bookings:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Error fetching bookings');
      setLoading(false);
      setBookings([]);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBookings();
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

  const deleteBooking = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this booking?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8000/api/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setBookings((prev) => prev.filter((booking) => booking._id !== id));
      setPagination((prev) => ({
        ...prev,
        totalBookings: prev.totalBookings - 1,
        totalPages: Math.ceil((prev.totalBookings - 1) / prev.limit),
      }));
      alert('Booking deleted successfully');
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert('Failed to delete booking');
    }
  };

  if (loading) {
    return (
      <div className="text-center text-teal-400 font-semibold">Loading...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Bookings</h2>

      {/* Search and Sort Controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <form onSubmit={handleSearch} className="flex-grow">
          <div className="flex gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by username or futsal name"
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
            <option value="bookingDate">Booking Date</option>
            <option value="totalAmount">Total Amount</option>
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
      {(error || bookings.length === 0) && (
        <div className="text-center py-10 text-red-500">
          {error || 'No bookings found'}
        </div>
      )}

      {/* Table and Pagination (only shown if bookings exist) */}
      {bookings.length > 0 && (
        <>
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Futsal Arena
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.futsalArena ? booking.futsalArena.name : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {booking.user ? `${booking.user.FirstName} ${booking.user.LastName}` : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.bookingDate
                        ? new Date(booking.bookingDate).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.startTime || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.endTime || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₨{booking.totalAmount || 'N/A'}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        className="text-red-600 hover:text-red-800 p-2"
                        onClick={() => deleteBooking(booking._id)}
                      >
                        <FaTrashAlt size={18} />
                      </button>
                    </td> */}
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                     <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {booking?.status || 'N/A'}
                      </span>
                    </td>
                   
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Showing {bookings.length} of {pagination.totalBookings} bookings
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

export default Bookings;