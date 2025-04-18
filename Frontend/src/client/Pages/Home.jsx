import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import Footer from "../components/Footer";
import Hero from "../components/Hero";




const Home = () => {
  const [futsals, setFutsals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFutsals = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/futsal");
        if (response.status === 200) {
          setFutsals(response.data.futsals);
        }
      } catch (error) {
        console.error("Error fetching futsals:", error);
      }
    };

    fetchFutsals();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Hero></Hero>
      {/* Featured Futsals */}
      <div className="container mx-auto max-w-screen-xl px-3 lg:px-6 py-6 ">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-6">
          Featured Courts
        </h2>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {futsals.length > 0 ? (
            futsals.map((futsal) => (
              <div
                key={futsal._id}
                className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"

              >
                {/* Image Section */}
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center relative">
                  {futsal.images?.length > 0 ? (
                    <img
                      src={"http://localhost:8000/" + futsal.images[0]}
                      alt={futsal.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No Image Available</span>
                  )}
                  <span className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-lg">
                    Rs{futsal.pricePerHour || "1000"}/hr
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-3">
                  {/* Name & Location */}
                  <h3 className="text-lg font-semibold text-gray-800">
                    {futsal.name}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center">
                    <FaMapMarkerAlt className="text-red-500 mr-1" /> {futsal.location || "Unknown City"}
                  </p>

                  {/* Ratings & Reviews */}
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span className="flex items-center">
                      <FaStar className="text-yellow-500 mr-1" />
                      {futsal.avgRating && futsal.avgRating !== "No ratings" ? (
                        `${futsal.avgRating} (${futsal.reviewCount} review${futsal.reviewCount === 1 ? "" : "s"})`
                      ) : (
                        "No reviews yet"
                      )}

                    </span>
                  </div>

                  {/* Booking Buttons */}
                  <div className="flex justify-between mt-4">
                    <button
                    className="text-emerald-600 font-semibold hover:text-emerald-700"

                      onClick={() => navigate(`/futsal/${futsal._id}`)}
                    >
                      View Details
                    </button>
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
                      
                      
                      onClick={() => navigate(`/book/${futsal._id}`)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No futsals available.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );

};

export default Home;