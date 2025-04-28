// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaUsers, FaFutbol, FaMoneyBillWave, FaStar, FaCalendarCheck } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

// const AdminDashboard = () => {
//   const [dashboardData, setDashboardData] = useState({
//     users: [],
//     futsals: [],
//     bookings: [],
//     payments: [],
//     reviews: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem('token'); // Assuming token-based auth
//         const config = { headers: { Authorization: `Bearer ${token}` } };

//         // Fetch all users, futsals, bookings, payments, and reviews
//         const [usersRes, futsalsRes, bookingsRes, paymentsRes, reviewsRes] = await Promise.all([
//           axios.get('http://localhost:8000/api/admin/allusers', config),
//           axios.get('http://localhost:8000/api/futsals', config),
//           axios.get('http://localhost:8000/api/admin/bookings', config),
//           axios.get('http://localhost:8000/api/admin/payment/arena', config),
//           axios.get('http://localhost:8000/api/admin/reviews', config),
//         ]);

//         setDashboardData({
//           users: usersRes.data.users || [],
//           futsals: futsalsRes.data.futsals || [],
//           bookings: bookingsRes.data.bookings || [],
//           payments: paymentsRes.data || [],
//           reviews: reviewsRes.data.reviews || [],
//         });
//       } catch (err) {
//         console.error('Error fetching dashboard data:', err.message);
//         setError('Failed to load dashboard data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   if (loading) return <div className="text-center py-10">Loading...</div>;
//   if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

//   const { users, futsals, bookings, payments, reviews } = dashboardData;

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold text-teal-600 mb-8">Admin Dashboard</h1>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
//           <FaUsers className="text-teal-500 text-3xl" />
//           <div>
//             <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
//             <p className="text-2xl font-bold text-teal-600">{users.length}</p>
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
//           <FaFutbol className="text-teal-500 text-3xl" />
//           <div>
//             <h2 className="text-lg font-semibold text-gray-700">Total Futsals</h2>
//             <p className="text-2xl font-bold text-teal-600">{futsals.length}</p>
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
//           <FaCalendarCheck className="text-teal-500 text-3xl" />
//           <div>
//             <h2 className="text-lg font-semibold text-gray-700">Total Bookings</h2>
//             <p className="text-2xl font-bold text-teal-600">{bookings.length}</p>
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
//           <FaMoneyBillWave className="text-teal-500 text-3xl" />
//           <div>
//             <h2 className="text-lg font-semibold text-gray-700">Total Revenue</h2>
//             <p className="text-2xl font-bold text-teal-600">NPR {payments.reduce((sum, p) => sum + p.amount, 0)}</p>
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
//           <FaStar className="text-teal-500 text-3xl" />
//           <div>
//             <h2 className="text-lg font-semibold text-gray-700">Total Reviews</h2>
//             <p className="text-2xl font-bold text-teal-600">{reviews.length}</p>
//           </div>
//         </div>
//       </div>

//       {/* Recent Bookings Table */}
//       <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//         <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Bookings</h2>
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-teal-50">
//               <th className="px-4 py-2 text-left">User</th>
//               <th className="px-4 py-2 text-left">Futsal</th>
//               <th className="px-4 py-2 text-left">Date</th>
//               <th className="px-4 py-2 text-left">Time</th>
//               <th className="px-4 py-2 text-left">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {bookings.slice(0, 5).map((booking) => (
//               <tr key={booking._id} className="border-b">
//                 <td className="px-4 py-2">{booking.user?.FirstName} {booking.user?.LastName}</td>
//                 <td className="px-4 py-2">{booking.futsalArena?.name}</td>
//                 <td className="px-4 py-2">{new Date(booking.bookingDate).toLocaleDateString()}</td>
//                 <td className="px-4 py-2">{booking.startTime} - {booking.endTime}</td>
//                 <td className="px-4 py-2">
//                   <span className={`px-2 py-1 rounded ${
//                     booking.status === 'completed' ? 'bg-green-100 text-green-700' : 
//                     booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
//                     'bg-blue-100 text-blue-700'
//                   }`}>
//                     {booking.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <button
//           onClick={() => navigate('/admin/bookings')}
//           className="mt-4 text-teal-600 hover:text-teal-800 font-semibold"
//         >
//           View All Bookings
//         </button>
//       </div>

//       {/* Recent Futsals Table */}
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Futsals</h2>
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-teal-50">
//               <th className="px-4 py-2 text-left">Name</th>
//               <th className="px-4 py-2 text-left">Location</th>
//               <th className="px-4 py-2 text-left">Owner</th>
//             </tr>
//           </thead>
//           <tbody>
//             {futsals.slice(0, 5).map((futsal) => (
//               <tr key={futsal._id} className="border-b">
//                 <td className="px-4 py-2">{futsal.name}</td>
//                 <td className="px-4 py-2">{futsal.location}</td>
//                 <td className="px-4 py-2">{futsal.createdBy?.FirstName} {futsal.createdBy?.LastName}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <button
//           onClick={() => navigate('/admin/arenas')}
//           className="mt-4 text-teal-600 hover:text-teal-800 font-semibold"
//         >
//           View All Futsals
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaFutbol, FaMoneyBillWave, FaStar, FaCalendarCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    users: [],
    futsals: [],
    bookings: [],
    payments: [],
    reviews: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [usersRes, futsalsRes, bookingsRes, paymentsRes, reviewsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/admin/allusers', config).catch(() => ({ data: { users: [] } })),
          axios.get('http://localhost:8000/api/futsals', config).catch(() => ({ data: { futsals: [] } })),
          axios.get('http://localhost:8000/api/admin/bookings', config).catch(() => ({ data: { bookings: [] } })),
          axios.get('http://localhost:8000/api/admin/payment/arena', config).catch(() => ({ data: [] })),
          axios.get('http://localhost:8000/api/admin/reviews', config).catch(() => ({ data: { reviews: [] } })),
        ]);

        setDashboardData({
          users: usersRes.data.users || [],
          futsals: futsalsRes.data.futsals || [],
          bookings: bookingsRes.data.bookings || [],
          payments: paymentsRes.data.payments || [],
          reviews: reviewsRes.data.reviews || [],
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err.message);
        // Treat 404 or any error as empty data
        setDashboardData({
          users: [],
          futsals: [],
          bookings: [],
          payments: [],
          reviews: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  const { users, futsals, bookings, payments, reviews } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-teal-600 mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <FaUsers className="text-teal-500 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
            <p className="text-2xl font-bold text-teal-600">{users.length || 0}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <FaFutbol className="text-teal-500 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Total Futsals</h2>
            <p className="text-2xl font-bold text-teal-600">{futsals.length || 0}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <FaCalendarCheck className="text-teal-500 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Total Bookings</h2>
            <p className="text-2xl font-bold text-teal-600">{bookings.length || 0}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <FaMoneyBillWave className="text-teal-500 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Total Revenue</h2>
            <p className="text-2xl font-bold text-teal-600">
              NPR {payments.reduce((sum, p) => sum + (p.amount || 0), 0) || 0}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <FaStar className="text-teal-500 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Total Reviews</h2>
            <p className="text-2xl font-bold text-teal-600">{reviews.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No bookings yet.</p>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-teal-50">
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Futsal</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((booking) => (
                <tr key={booking._id} className="border-b">
                  <td className="px-4 py-2">
                    {booking.user?.FirstName || 'N/A'} {booking.user?.LastName || ''}
                  </td>
                  <td className="px-4 py-2">{booking.futsalArena?.name || 'N/A'}</td>
                  <td className="px-4 py-2">
                    {booking.bookingDate
                      ? new Date(booking.bookingDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-4 py-2">
                    {booking.startTime || 'N/A'} - {booking.endTime || 'N/A'}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        booking.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {booking.status || 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button
          onClick={() => navigate('/admin/bookings')}
          className="mt-4 text-teal-600 hover:text-teal-800 font-semibold"
        >
          View All Bookings
        </button>
      </div>

      {/* Recent Futsals Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Futsals</h2>
        {futsals.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No futsals yet.</p>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-teal-50">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Owner</th>
              </tr>
            </thead>
            <tbody>
              {futsals.slice(0, 5).map((futsal) => (
                <tr key={futsal._id} className="border-b">
                  <td className="px-4 py-2">{futsal.name || 'N/A'}</td>
                  <td className="px-4 py-2">{futsal.location || 'N/A'}</td>
                  <td className="px-4 py-2">
                    {futsal.createdBy?.FirstName || 'N/A'} {futsal.createdBy?.LastName || ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button
          onClick={() => navigate('/admin/arenas')}
          className="mt-4 text-teal-600 hover:text-teal-800 font-semibold"
        >
          View All Futsals
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;