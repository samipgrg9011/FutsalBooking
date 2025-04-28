// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const PaymentArena = () => {
//     const [payments, setPayments] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchPayments = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8000/api/owner/payment/arena', {
//                     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//                 });

                
//             console.log("Payment response:", response.data); 

//                 setPayments(response.data);
//                 setLoading(false);
//             } catch (err) {
//                 setError(err.response?.data?.error || 'Failed to load payments');
//                 setLoading(false);
//             }
//         };

        

//         fetchPayments();
//     }, []);

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//         );
//     }



//     return (
//         <div className="max-w-7xl mx-auto px-6 py-8">
//             <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Arena Payments</h2>

//             {payments.length === 0 ? (
//                 <div className="text-center py-10 text-gray-500">
//                     No payments found for your arenas
//                 </div>
//             ) : (
//                 <div className="overflow-x-auto shadow-md rounded-lg">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-100">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {payments.map((payment) => (
//                                 <tr key={payment._id} className="hover:bg-gray-50">
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                         {payment.paymentIdx || 'N/A'}
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                         {payment.bookingId?._id || 'N/A'}
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         <div className="text-sm text-gray-500">
//                                             {payment.userId.FirstName} {payment.userId.LastName}
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs{payment.amount}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                                             payment.paymentStatus === 'completed'
//                                                 ? 'bg-green-100 text-green-800'
//                                                 : 'bg-yellow-100 text-yellow-800'
//                                         }`}>
//                                             {payment?.paymentStatus}
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                         {new Date(payment.bookingId?.bookingDate).toLocaleDateString()}
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                         {payment.bookingId?.startTime} - {payment.bookingId?.endTime}
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                         {payment?.transactionId || 'N/A'}
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                         {new Date(payment?.paymentDate).toLocaleString()}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PaymentArena;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentArena = () => {
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({
    totalPayments: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 5,
  });
  const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({
    sortBy: 'paymentDate',
    sortOrder: 'desc',
  });
  const [page, setPage] = useState(1);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/owner/payment/arena', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: {
          search,
          ...sort,
          page,
          limit: pagination.limit,
        },
      });

      setPayments(response.data.payments);
      setPagination(response.data.pagination);
      setLoading(false);
    } catch (err) {
    //   setError(err.response?.data?.error || 'Failed to load payments');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPayments();
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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Arena Payments</h2>

      {/* Search and Sort Controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <form onSubmit={handleSearch} className="flex-grow">
          <div className="flex gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by username, transaction ID, or payment ID"
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
            <option value="paymentDate">Payment Date</option>
            <option value="amount">Total Amount</option>
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
{/* 
      {error && <div className="text-red-500 mb-4">{error}</div>} */}

      {payments.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No payments found for your arenas
        </div>
      ) : (
        <>
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {payment.paymentIdx || 'N/A'}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {payment.bookingId?._id || 'N/A'}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {payment.userId?.FirstName} {payment.userId?.LastName}
                      </div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      Rs {payment.amount}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.paymentStatus === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {payment?.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {payment.bookingId?.bookingDate
                        ? new Date(payment.bookingId.bookingDate).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {payment.bookingId?.startTime} - {payment.bookingId?.endTime}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {payment?.transactionId || 'N/A'}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {payment.paymentDate
                        ? new Date(payment.paymentDate).toLocaleString()
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
              Showing {payments.length} of {pagination.totalPayments} payments
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

export default PaymentArena;