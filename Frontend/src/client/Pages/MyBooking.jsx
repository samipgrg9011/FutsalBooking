// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaCheckCircle, FaTimesCircle, FaClock, FaMapMarkerAlt, FaCalendarAlt, FaDollarSign } from "react-icons/fa";
// import axios from "axios";

// const MyBooking = () => {
//   const navigate = useNavigate();
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchBookings = async () => {
//     try {
//       const response = await axios.get("http://localhost:8000/api/booking", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setBookings(response.data);
//     } catch (error) {
//       console.error("Error fetching bookings:", error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem("token");
//         navigate("/login");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const formatDate = (dateString) => {
//     const options = { year: "numeric", month: "long", day: "numeric" };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       {/* <div className="container mx-auto px-6 lg:px-16"> */}
//       <div className="container  mx-auto max-w-screen-xl px-6 lg:px-6 py-3">

     
//         <h1 className="font-bold text-[30px] text-green-600 mb-5 text-center">
//           Your Bookings
//         </h1>

//         {loading ? (
//           <div className="text-center text-gray-500 animate-pulse">Loading bookings...</div>
//         ) : bookings.length > 0 ? (
//           <div className="grid gap-8">
//             {bookings.map((booking) => (
//               <div
//                 key={booking._id}
//                 className="relative bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300 border border-gray-100"
//               >


//                 <div className="flex flex-col md:flex-row">
//                   {/* Image Section */}
//                   <div className="md:w-2/5 h-80 overflow-hidden my-6 ml-6 rounded-lg shadow-lg">
//                     {booking.futsalArena?.images?.[0] ? (
//                       <img
//                         src={`http://localhost:8000/${booking.futsalArena.images[0]}`}
//                         alt="Futsal Arena"
//                         className="w-full h-full object-cover rounded-lg"
//                       />
//                     ) : (
//                       <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
//                         <span className="text-gray-400 font-medium">No Image Available</span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Details Section */}
//                   <div className="md:w-3/5 p-8 flex flex-col justify-between min-h-[300px]"> {/* Reduced min-height */}
//                     <div>
//                       <h2 className="text-2xl font-bold text-gray-900 mb-8 "> {/* Increased text size */}
//                         {booking.futsalArena?.name || "N/A"}
//                       </h2>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-gray-700 items-start">
//                         <div className="space-y-10"> {/* Reduced from space-y-6 to space-y-4 */}
//                           <div className="flex items-start gap-3">
//                             <FaMapMarkerAlt className="text-gray-400 mt-1 text-lg" /> {/* Increased icon size */}
//                             <div>
//                               <p className="font-medium text-lg text-gray-500">Location</p>
//                               <p className="text-lg text-gray-800 leading-relaxed"> {/* Increased text size */}
//                                 {booking.futsalArena?.location || "Address not available"}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="flex items-start gap-3">
//                             <FaCalendarAlt className="text-gray-400 mt-1 text-lg" /> {/* Increased icon size */}
//                             <div>
//                               <p className="font-medium text-lg text-gray-500">Date</p>
//                               <p className="text-lg text-gray-800"> {/* Increased text size */}
//                                 {formatDate(booking.bookingDate)}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="space-y-10"> {/* Reduced from space-y-6 to space-y-4 */}
//                           <div className="flex items-start gap-3">
//                             <FaClock className="text-gray-400 mt-1 text-lg" /> {/* Increased icon size */}
//                             <div>
//                               <p className="font-medium text-lg text-gray-500">Time</p>
//                               <p className="text-lg text-gray-800"> {/* Increased text size */}
//                                 {booking.startTime} - {booking.endTime}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="flex items-start gap-3">
//                             <FaDollarSign className="text-gray-400 mt-1 text-lg" /> {/* Increased icon size */}
//                             <div>
//                               <p className="font-medium text-lg text-gray-500">Total</p>
//                               <p className="text-indigo-600 font-semibold text-xl"> {/* Increased text size */}
//                                 Rs{booking.totalAmount}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Button */}
//                     <div className="mt-4"> {/* Reduced from mt-6 to mt-4 */}
//                       <button
//                         onClick={() => navigate(`/booking/${booking._id}`)}
//                         className="group inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg text-lg" // Increased button size and text
//                       >
//                         View Details
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M9 5l7 7-7 7"
//                           />
//                         </svg>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12 bg-white rounded-xl shadow-md">
//             <p className="text-gray-500 text-lg">No bookings found.</p>
//             <button
//               onClick={() => navigate("/")}
//               className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
//             >
//               Book Now →
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyBooking;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaClock, FaMapMarkerAlt, FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import axios from "axios";

const MyBooking = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState({
    completed: [],
    current: [],
    upcoming: [],
  });
  const [selectedCategory, setSelectedCategory] = useState("upcoming"); // Default to 'upcoming'
  const [loading, setLoading] = useState(true);

  // Fetch bookings from the backend
  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/booking", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBookings(response.data); // Expecting { completed: [], current: [], upcoming: [] }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render a single booking card
  const renderBookingCard = (booking) => (
    <div
      key={booking._id}
      className="relative bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300 border border-gray-100"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-2/5 h-80 overflow-hidden my-6 ml-6 rounded-lg shadow-lg">
          {booking.futsalArena?.images?.[0] ? (
            <img
              src={`http://localhost:8000/${booking.futsalArena.images[0]}`}
              alt="Futsal Arena"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
              <span className="text-gray-400 font-medium">No Image Available</span>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="md:w-3/5 p-8 flex flex-col justify-between min-h-[300px]">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {booking.futsalArena?.name || "N/A"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-gray-700 items-start">
              <div className="space-y-10">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-gray-400 mt-1 text-lg" />
                  <div>
                    <p className="font-medium text-lg text-gray-500">Location</p>
                    <p className="text-lg text-gray-800 leading-relaxed">
                      {booking.futsalArena?.location || "Address not available"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCalendarAlt className="text-gray-400 mt-1 text-lg" />
                  <div>
                    <p className="font-medium text-lg text-gray-500">Date</p>
                    <p className="text-lg text-gray-800">
                      {formatDate(booking.bookingDate)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-10">
                <div className="flex items-start gap-3">
                  <FaClock className="text-gray-400 mt-1 text-lg" />
                  <div>
                    <p className="font-medium text-lg text-gray-500">Time</p>
                    <p className="text-lg text-gray-800">
                      {booking.startTime} - {booking.endTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaDollarSign className="text-gray-400 mt-1 text-lg" />
                  <div>
                    <p className="font-medium text-lg text-gray-500">Total</p>
                    <p className="text-indigo-600 font-semibold text-xl">
                      Rs{booking.totalAmount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="mt-4">
            <button
              onClick={() => navigate(`/booking/${booking._id}`)}
              className="group inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg text-lg"
            >
              View Details
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-screen-xl px-6 lg:px-6 py-3">
        <h1 className="font-bold text-[30px] text-green-600 mb-5 text-center">
          Your Bookings
        </h1>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setSelectedCategory("upcoming")}
            className={`px-6 py-2 mx-2 rounded-lg font-medium text-lg ${
              selectedCategory === "upcoming"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setSelectedCategory("current")}
            className={`px-6 py-2 mx-2 rounded-lg font-medium text-lg ${
              selectedCategory === "current"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Current
          </button>
          <button
            onClick={() => setSelectedCategory("completed")}
            className={`px-6 py-2 mx-2 rounded-lg font-medium text-lg ${
              selectedCategory === "completed"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Completed
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 animate-pulse">
            Loading bookings...
          </div>
        ) : bookings[selectedCategory].length > 0 ? (
          <div className="grid gap-8">
            {bookings[selectedCategory].map((booking) =>
              renderBookingCard(booking)
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-500 text-lg">
              No {selectedCategory} bookings found.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Book Now →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooking;