import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FindFutsalCourts = () => {
  const [futsals, setFutsals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [sortByPrice, setSortByPrice] = useState("relevance");
  const [priceFrom, setPriceFrom] = useState(""); // Empty string for uncontrolled input initially
  const [priceTo, setPriceTo] = useState(""); // Empty string for "unlimited" initially

  const navigate = useNavigate();

  // Fetch futsals from the backend
  const fetchFutsals = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/futsal", {
        params: {
          searchTerm,
          location,
          sortByPrice,
          priceFrom: priceFrom || 0, // Default to 0 if empty
          priceTo: priceTo || undefined, // Treat empty as "unlimited"
        },
      });
      setFutsals(response.data.futsals);
    } catch (error) {
      console.error("Error fetching futsals:", error);
    }
  };

  // Fetch futsals only on component mount (initial load)
  useEffect(() => {
    fetchFutsals();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-screen-xl px-3 lg:px-6 py-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Find Futsal Courts
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>

              {/* Search by Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search courts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter location..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price From
                    </label>
                    <input
                      type="number"
                      placeholder="Min price"
                      value={priceFrom}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || Number(value) >= 0) {
                          setPriceFrom(value);
                        }
                      }}
                      min={0}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price To
                    </label>
                    <input
                      type="number"
                      placeholder="Max price"
                      value={priceTo}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || Number(value) >= 0) {
                          setPriceTo(value);
                        }
                      }}
                      min={0}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort by
                </label>
                <select
                  value={sortByPrice}
                  onChange={(e) => setSortByPrice(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="asc">Price: Low to High</option>
                  <option value="desc">Price: High to Low</option>
                </select>
              </div>

              {/* Apply Filters Button */}
              <button
                onClick={fetchFutsals}
                className="w-full bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Futsal Courts Grid */}
          <div className="w-full lg:w-3/4">
            {/* Results Count and Sort */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">Showing {futsals.length} results</p>
              
            </div>

            {/* Futsal Cards */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {futsals.length > 0 ? (
                futsals.map((futsal) => (
                  <div
                    key={futsal._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    {/* Image Section */}
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center relative">
                      {futsal.images?.length > 0 ? (
                        <img
                          src={"http://localhost:8000/" + futsal.images[0]}
                          alt={futsal.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-400 text-sm">
                            No Image Available
                          </span>
                        </div>
                      )}
                      <span className="absolute top-2 right-2 bg-white text-black text-sm font-semibold px-2 py-1 rounded-lg shadow">
                        Rs{futsal.pricePerHour || "1000"}/hr
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-2">
                      {/* Name */}
                      <h3 className="text-md font-semibold text-gray-800">
                        {futsal.name}
                      </h3>

                      {/* Location */}
                      <p className="text-sm text-gray-500 flex items-center">
                        <FaMapMarkerAlt className="text-gray-500 mr-1" />{" "}
                        {futsal.location || "Unknown City"}
                      </p>

                      {/* Ratings */}
                      {/* Ratings */}
                      <div className="flex items-center text-sm text-gray-600">
                        <FaStar className="text-yellow-500 mr-1" />
                        {futsal.avgRating && futsal.avgRating !== "No ratings" ? (
                          `${futsal.avgRating} (${futsal.reviewCount || 0} review${futsal.reviewCount === 1 ? "" : "s"
                          })`
                        ) : (
                          "No reviews yet"
                        )}
                      </div>


                      {/* Buttons */}
                      <div className="flex justify-between mt-4">
                        <button
                          className="text-gray-600 font-semibold hover:underline"
                          onClick={() => navigate(`/futsal/${futsal._id}`)}
                        >
                          View Details
                        </button>
                        <button
                          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                          onClick={() => navigate(`/book/${futsal._id}`)}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-full">
                  No futsals available.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindFutsalCourts;