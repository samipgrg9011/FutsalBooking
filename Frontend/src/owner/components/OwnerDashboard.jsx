// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaFutbol, FaMoneyBillWave, FaStar, FaCalendarCheck } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

// const OwnerDashboard = () => {
//   const [dashboardData, setDashboardData] = useState({
//     bookings: [],
//     payments: [],
//     reviews: [],
//     futsals: [],
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

//         // Fetch owner's bookings, payments, reviews, and futsals
//         const [bookingsRes, paymentsRes, reviewsRes, futsalsRes] = await Promise.all([
//           axios.get('http://localhost:8000/api/owner/bookings', config),
//           axios.get('http://localhost:8000/api/owner/payment/arena', config),
//           axios.get('http://localhost:8000/api/owner/reviews', config),
//           axios.get('http://localhost:8000/api/futsals/owner', config),
//         ]);

//         console.log('Bookings:', bookingsRes.data);
// console.log('Payments:', paymentsRes.data);
// console.log('Reviews:', reviewsRes.data);
// console.log('Futsals:', futsalsRes.data);


//         setDashboardData({
//           bookings: bookingsRes.data.bookings || [],
//           payments: paymentsRes.data || [],
//           reviews: reviewsRes.data.reviews || [],
//   futsals: futsalsRes.data.futsals || [], 
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

//   const { bookings, payments, reviews, futsals } = dashboardData;

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold text-teal-600 mb-8">Owner Dashboard</h1>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
//             <h2 className="text-lg font-semibold text-gray-700">Total Payments</h2>
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
//         <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
//           <FaFutbol className="text-teal-500 text-3xl" />
//           <div>
//             <h2 className="text-lg font-semibold text-gray-700">Futsal Arenas</h2>
//             <p className="text-2xl font-bold text-teal-600">{futsals.length}</p>
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
//           onClick={() => navigate('/owner/bookings')}
//           className="mt-4 text-teal-600 hover:text-teal-800 font-semibold"
//         >
//           View All Bookings
//         </button>
//       </div>

//       {/* Recent Payments Table */}
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Payments</h2>
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-teal-50">
//               <th className="px-4 py-2 text-left">User</th>
//               <th className="px-4 py-2 text-left">Amount</th>
//               <th className="px-4 py-2 text-left">Date</th>
//               <th className="px-4 py-2 text-left">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {payments.slice(0, 5).map((payment) => (
//               <tr key={payment._id} className="border-b">
//                 <td className="px-4 py-2">{payment.userId?.FirstName} {payment.userId?.LastName}</td>
//                 <td className="px-4 py-2">NPR {payment.amount}</td>
//                 <td className="px-4 py-2">{new Date(payment.paymentDate).toLocaleDateString()}</td>
//                 <td className="px-4 py-2">
//                   <span className={`px-2 py-1 rounded ${
//                     payment.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' : 
//                     'bg-red-100 text-red-700'
//                   }`}>
//                     {payment.paymentStatus}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <button
//           onClick={() => navigate('/owner/payments')}
//           className="mt-4 text-teal-600 hover:text-teal-800 font-semibold"
//         >
//           View All Payments
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OwnerDashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFutbol, FaMoneyBillWave, FaStar, FaCalendarCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    bookings: [],
    payments: [],
    reviews: [],
    futsals: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };

        console.log('Fetching data from endpoints:');
        console.log('Bookings: http://localhost:8000/api/owner/bookings');
        console.log('Payments: http://localhost:8000/api/owner/payment/arena');
        console.log('Reviews: http://localhost:8000/api/owner/reviews');
        console.log('Futsals: http://localhost:8000/api/futsals/owner');

        // Fetch data with fallbacks for all endpoints
        const [bookingsRes, paymentsRes, reviewsRes, futsalsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/owner/bookings', config).catch((err) => {
            console.warn('Bookings endpoint failed:', err.message);
            return { data: { bookings: [] } };
          }),
          axios.get('http://localhost:8000/api/owner/payment/arena', config).catch((err) => {
            console.warn('Payments endpoint failed:', err.message);
            return { data: { payments: [] }  };
          }),
          axios.get('http://localhost:8000/api/owner/reviews', config).catch((err) => {
            console.warn('Reviews endpoint failed:', err.message);
            return { data: { reviews: [] } };
          }),
          axios.get('http://localhost:8000/api/futsals/owner', config).catch((err) => {
            console.warn('Futsals endpoint failed:', err.message);
            return { data: { futsals: [] } };
          }),
        ]);

        console.log('Bookings Response:', bookingsRes.data);
        console.log('Payments Response:', paymentsRes.data);
        console.log('Reviews Response:', reviewsRes.data);
        console.log('Futsals Response:', futsalsRes.data);

        // Set dashboard data with strict validation
        setDashboardData({
          bookings: Array.isArray(bookingsRes.data.bookings) ? bookingsRes.data.bookings : [],
          payments: Array.isArray(paymentsRes.data.payments) ? paymentsRes.data.payments : [],
          reviews: Array.isArray(reviewsRes.data.reviews) ? reviewsRes.data.reviews : [],
          futsals: Array.isArray(futsalsRes.data.futsals) ? futsalsRes.data.futsals : [],
        });
      } catch (err) {
        console.error('Critical error fetching dashboard data:', err.message);
        setError(err.message || 'Failed to fetch dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  const { bookings, payments, reviews, futsals } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-teal-600 mb-8">Owner Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <FaCalendarCheck className="text-teal-500 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Total Bookings</h2>
            <p className="text-2xl font-bold text-teal-600">{bookings.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <FaMoneyBillWave className="text-teal-500 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Total Payments</h2>
            <p className="text-2xl font-bold text-teal-600">NPR {payments.reduce((sum, p) => sum + (p.amount || 0), 0)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <FaStar className="text-teal-500 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Total Reviews</h2>
            <p className="text-2xl font-bold text-teal-600">{reviews.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <FaFutbol className="text-teal-500 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Futsal Arenas</h2>
            <p className="text-2xl font-bold text-teal-600">{futsals.length}</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Bookings</h2>
        {bookings.length > 0 ? (
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
                  <td className="px-4 py-2">{booking.user?.FirstName || 'N/A'} {booking.user?.LastName || ''}</td>
                  <td className="px-4 py-2">{booking.futsalArena?.name || 'N/A'}</td>
                  <td className="px-4 py-2">{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-4 py-2">{booking.startTime || 'N/A'} - {booking.endTime || 'N/A'}</td>
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
        ) : (
          <p className="text-center text-gray-500">No bookings yet</p>
        )}
        <button
          onClick={() => navigate('/owner/bookings')}
          className="mt-4 text-teal-600 hover:text-teal-800 font-semibold"
        >
          View All Bookings
        </button>
      </div>

      {/* Recent Payments Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Payments</h2>
        {payments.length > 0 ? (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-teal-50">
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.slice(0, 5).map((payment) => (
                <tr key={payment._id} className="border-b">
                  <td className="px-4 py-2">{payment.userId?.FirstName || 'N/A'} {payment.userId?.LastName || ''}</td>
                  <td className="px-4 py-2">NPR {payment.amount || 0}</td>
                  <td className="px-4 py-2">{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        payment.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {payment.paymentStatus || 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No payments yet</p>
        )}
        <button
          onClick={() => navigate('/owner/payments')}
          className="mt-4 text-teal-600 hover:text-teal-800 font-semibold"
        >
          View All Payments
        </button>
      </div>
    </div>
  );
};

export default OwnerDashboard;
