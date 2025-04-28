// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { FaCalendarAlt, FaMapMarkerAlt, FaStar, FaArrowLeft, FaClock, FaPhone, FaEnvelope } from "react-icons/fa";
// import Footer from "../components/Footer";

// const FutsalDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [futsal, setFutsal] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchFutsalDetail = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8000/api/futsal/${id}`);
//         if (response.status === 200) {
//           setFutsal(response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching futsal details:", error);
//         setError("Failed to load futsal details. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFutsalDetail();
//   }, [id]);

//   if (loading) return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       <p className="text-xl text-gray-600 animate-pulse">Loading...</p>
//     </div>
//   );
//   if (error) return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       <p className="text-xl text-red-600">{error}</p>
//     </div>
//   );
//   if (!futsal) return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       <p className="text-xl text-gray-600">Futsal not found.</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       <div className="container mx-auto max-w-screen-xl px-6 lg:px-6 py-6">
//         {/* Back Button */}
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center text-gray-700 hover:text-blue-600 mb-5"
//         >
//           <FaArrowLeft size={20} className="mr-2" />
//           Back
//         </button>

//         {/* Futsal Name and Rating */}
//         <div className="mb-5">
//           <h1 className="text-2xl font-bold text-gray-900">{futsal.name}</h1>
//           <div className="flex items-center text-gray-600">
//             <FaStar className="text-yellow-400 mr-2" />
//             <span>4.8 (124 reviews)</span>
//           </div>
//         </div>

//         {/* Main Content: Image Gallery and Details */}
//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
//           {/* Left: Large Image + Description */}
//           <div className="lg:col-span-3 flex flex-col gap-4">
//             <img
//               src={futsal.images?.[0] ? `http://localhost:8000/${futsal.images[0]}` : "unavailable"}
//               alt={`${futsal.name} view 1`}
//               className="w-full h-[415px] object-cover rounded-lg shadow-md"
//             />
//             <div className="mt-4">
//               <h3 className="text-xl font-semibold text-gray-800 mb-4">About this futsal court</h3>
//               <p className="text-gray-600 text-sm leading-relaxed">
//                 {futsal.description || "No description available."}
//               </p>
//             </div>
//           </div>
          

//           {/* Right: 2x2 Grid of Smaller Images + Contact & Location */}
//           <div className="lg:col-span-2 flex flex-col gap-4">
//             {/* 2x2 Grid of Smaller Images */}
//             <div className="grid grid-cols-2 gap-4">
//               <img
//                 src={futsal.images?.[1] ? `http://localhost:8000/${futsal.images[1]}` : "unavailable"}
//                 alt={`${futsal.name} view 2`}
//                 className="w-full h-[200px] object-cover rounded-lg shadow-md"
//               />
//               <img
//                 src={futsal.images?.[2] ? `http://localhost:8000/${futsal.images[2]}` : "unavailable"}
//                 alt={`${futsal.name} view 3`}
//                 className="w-full h-[200px] object-cover rounded-lg shadow-md"
//               />
//               <img
//                 src={futsal.images?.[3] ? `http://localhost:8000/${futsal.images[3]}` : "unavailable"}
//                 alt={`${futsal.name} view 4`}
//                 className="w-full h-[200px] object-cover rounded-lg shadow-md"
//               />
//               <img
//                 src={futsal.images?.[4] ? `http://localhost:8000/${futsal.images[4]}` : "unavailable"}
//                 alt={`${futsal.name} view 5`}
//                 className="w-full h-[200px] object-cover rounded-lg shadow-md"
//               />
//             </div>

// {/* Enhanced Contact & Location Card */}
// <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col items-start w-full">
//   <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact & Location</h3>

//   {/* Location */}
//   <div className="flex items-start space-x-3 mb-3 w-full">
//     <FaMapMarkerAlt className="text-blue-500 mt-1 flex-shrink-0" />
//     <div>
//       <p className="text-gray-700 font-medium text-sm">Address</p>
//       <p className="text-gray-600 text-sm leading-relaxed">
//         {futsal.location || "pokhara, mahendrapool"}
//       </p>
//     </div>
//   </div>

//   {/* Contact Info */}
//   <div className="flex items-start space-x-3 mb-3 w-full">
//     <FaPhone className="text-green-500 mt-1 flex-shrink-0" />
//     <div>
//       <p className="text-gray-700 font-medium text-sm">Phone</p>
//       <p className="text-gray-600 text-sm">
//         {futsal.phone || "+977 123-456-7890"}
//       </p>
//     </div>
//   </div>

//   <div className="flex items-start space-x-3 mb-3 w-full">
//     <FaEnvelope className="text-red-500 mt-1 flex-shrink-0" />
//     <div>
//       <p className="text-gray-700 font-medium text-sm">Email</p>
//       <p className="text-gray-600 text-sm">
//         {futsal.email || "contact@futsal.com"}
//       </p>
//     </div>
//   </div>

//   {/* Pricing */}
//   <div className="mb-4 w-full">
//     <p className="text-gray-700 font-medium text-sm">Pricing</p>
//     <p className="text-blue-600 text-lg font-semibold">
//       Rs{futsal.pricePerHour || "1000"}<span className="text-gray-500 text-sm">/hr</span>
//     </p>
//   </div>

//   {/* Book Button */}
//   <button
//     className="w-full bg-black text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-800 transition-all duration-300 flex items-center justify-center"
//     onClick={() => navigate(`/book/${id}`)}
//   >
//     Book Now
//   </button>
//   <p className="text-gray-500 text-xs text-center mt-2 w-full">Secure your slot instantly!</p>
// </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default FutsalDetail;

// src/FutsalDetail.jsx

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaMapMarkerAlt, FaStar, FaArrowLeft, FaPhone, FaEnvelope } from "react-icons/fa";
import Footer from "../components/Footer";
import Review from "../components/Review";

const FutsalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [futsal, setFutsal] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch futsal and reviews data
  const fetchFutsalData = useCallback(async () => {
    try {
      const [futsalResponse, reviewsResponse] = await Promise.all([
        axios.get(`http://localhost:8000/api/futsal/${id}`),
        axios.get(`http://localhost:8000/api/futsal/${id}/reviews`),
      ]);
      console.log("Fetched futsal:", futsalResponse.data); // Debug log
      console.log("Fetched reviews:", reviewsResponse.data); // Debug

      if (futsalResponse.status === 200) setFutsal(futsalResponse.data);
      setReviews(reviewsResponse.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchFutsalData();
  }, [fetchFutsalData]);

  // Callback to handle review updates
  const handleReviewUpdate = async () => {
    await fetchFutsalData(); // Refetch futsal data to update avgRating and reviewCount
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <p className="text-xl text-gray-600 animate-pulse">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  if (!futsal)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <p className="text-xl text-gray-600">Futsal not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto max-w-screen-xl px-6 lg:px-6 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:text-blue-600 mb-5"
        >
          <FaArrowLeft size={20} className="mr-2" />
          Back
        </button>

        {/* Futsal Name and Dynamic Rating */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-900">{futsal.name}</h1>
          <div className="flex items-center text-gray-600">
            <FaStar className="text-yellow-400 mr-2" />
            <span>
              {futsal.avgRating} ({futsal.reviewCount} reviews)
            </span>
          </div>
        </div>

        {/* Main Content: Image Gallery and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Left: Large Image + Description + Reviews */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <img
              src={futsal.images?.[0] ? `http://localhost:8000/${futsal.images[0]}` : "/placeholder.jpg"}
              alt={`${futsal.name} view 1`}
              className="w-full h-[415px] object-cover rounded-lg shadow-md"
            />
            <div className="bg-white rounded-lg shadow-md p-6 mt-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">About this Futsal Court</h3>
              <p className="text-gray-700 text-base leading-relaxed mb-6">
                {futsal.description || "No description available."}
              </p>
              <Review
                reviews={reviews}
                setReviews={setReviews}
                futsalId={id}
                setError={setError}
                onReviewAdded={handleReviewUpdate} // Pass callback to Review component
              />
            </div>
          </div>

          {/* Right: 2x2 Grid of Smaller Images + Sticky Contact & Location */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={futsal.images?.[i] ? `http://localhost:8000/${futsal.images[i]}` : "/placeholder.jpg"}
                  alt={`${futsal.name} view ${i + 1}`}
                  className="w-full h-[200px] object-cover rounded-lg shadow-md"
                />
              ))}
            </div>

            {/* Sticky Contact & Location Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col items-start w-full sticky top-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact & Location</h3>
              <div className="flex items-start space-x-3 mb-3 w-full">
                <FaMapMarkerAlt className="text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 font-medium text-sm">Address</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {futsal.location || "Pokhara, Mahendrapool"}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 mb-3 w-full">
                <FaPhone className="text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 font-medium text-sm">Phone</p>
                  <p className="text-gray-600 text-sm">{futsal.createdBy.phoneNumber || "+977 123-456-7890"}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 mb-3 w-full">
                <FaEnvelope className="text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 font-medium text-sm">Email</p>
                  <p className="text-gray-600 text-sm">{futsal.createdBy.Email || "contact@futsal.com"}</p>
                </div>
              </div>
              <div className="mb-4 w-full">
                <p className="text-gray-700 font-medium text-sm">Pricing</p>
                <p className="text-blue-600 text-lg font-semibold">
                  Rs{futsal.pricePerHour || "1000"}
                  <span className="text-gray-500 text-sm">/hr</span>
                </p>
              </div>
              <button
                className="w-full bg-black text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-800 transition-all duration-300 flex items-center justify-center"
                onClick={() => navigate(`/book/${id}`)}
              >
                Book Now
              </button>
              <p className="text-gray-500 text-xs text-center mt-2 w-full">Secure your slot instantly!</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FutsalDetail;