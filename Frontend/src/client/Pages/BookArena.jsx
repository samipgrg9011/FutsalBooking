import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaClock, FaCheckCircle, FaExclamationCircle, FaMapMarkerAlt, FaStar, FaTimesCircle } from "react-icons/fa";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { format } from 'date-fns';

const BookArena = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [futsal, setFutsal] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchFutsalDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/futsal/${id}`);
        if (response.status === 200) {
          setFutsal(response.data);
        }
      } catch (error) {
        console.error("Error fetching futsal details:", error);
      }
    };

    fetchFutsalDetails();
  }, [id]);
  const fetchAvailableSlots = async (date) => {
    setFetchingSlots(true);
    setFetchError(null);

    try {
      const response = await axios.get("http://localhost:8000/api/available-slots", {
        params: { //Use params for query parameters
          futsalArena: id,
          bookingDate: date,
        }
      });

      setAvailableTimes(response.data.slots);
    } catch (error) {
      setFetchError("Failed to fetch available slots. Please try again.");
      console.error("Error fetching available slots:", error);
    } finally {
      setFetchingSlots(false);
    }
  };

  const handleDateChange = (e) => {
    const inputDate = e.target.value;
    const today = new Date().toISOString().split("T")[0];

    if (inputDate < today) {
      setSelectedDate(today);
      alert("You cannot select a past date.");
    } else {
      setSelectedDate(inputDate);
    }

    fetchAvailableSlots(inputDate);
    setBookingConfirmed(false);
  };
  // const handleDateChange = (e) => {
  //   const inputDate = e.target.value;
  //   const today = new Date();
  //   const currentMonth = today.getMonth();
  //   const currentYear = today.getFullYear();
  //   const selectedDateObj = new Date(inputDate);
  //   const selectedMonth = selectedDateObj.getMonth();
  //   const selectedYear = selectedDateObj.getFullYear();

  //   // Check if the selected date is in the current month
  //   if (inputDate < today.toISOString().split("T")[0] || selectedMonth !== currentMonth || selectedYear !== currentYear) {
  //     alert("Bookings are only allowed within the current month.");
  //     setSelectedDate(today.toISOString().split("T")[0]); // Reset to today's date
  //   } else {
  //     setSelectedDate(inputDate);
  //   }

  //   fetchAvailableSlots(inputDate);
  //   setBookingConfirmed(false);
  // };


  const handleRowClick = (start) => {
    const end = `${parseInt(start.split(":")[0]) + 1}:00`;
    setSelectedStartTime(start);
    setSelectedEndTime(end);
    setBookingConfirmed(false);
  };

  const calculateTotalAmount = () => {
    if (!futsal || !selectedStartTime || !selectedEndTime) return 0;
    return futsal.pricePerHour;
  };

  const handleBookingConfirmation = async () => {
    if (!selectedDate || !selectedStartTime || !selectedEndTime) {
      alert("Please select a date and time.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to book an arena.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const totalAmount = calculateTotalAmount();

      const response = await axios.post(
        `http://localhost:8000/api/book/${id}`,
        {
          futsalArena: id,
          bookingDate: selectedDate,
          startTime: selectedStartTime,
          endTime: selectedEndTime,
          totalAmount: totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      
      setBookingConfirmed(true);

      // Update the available slots immediately after booking
      setAvailableTimes((prevSlots) =>
        prevSlots.map((slot) =>
          slot.startTime === selectedStartTime ? { ...slot, status: "booked" } : slot
        )
      );

      console.log(response);
      window.location.href = response.data.paymentUrl

    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("Unauthorized: Please log in to proceed.");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Failed to create booking.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd/MM/yyyy");
  };

  if (!futsal) {
    return <div className="text-center py-8 text-gray-700">Loading futsal details...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-0 ">
      <ToastContainer />
      <div className="max-w-6xl  mx-auto bg-white rounded-xl shadow-2xl overflow-hidden flex">
        {/* Left Side: Calendar and Available Schedule */}
        <div className="w-1/2 p-8 border-r border-gray-200">
          {/* Date Selection */}
          <div className="mb-8">
            <label className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FaCalendarAlt className="text-gray-600" /> Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          {/* Time Slot Selection */}
          <div className="mb-8">
            <label className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FaClock className="text-gray-600" /> Select Time Slot
            </label>
            {selectedDate && ( // Only show this section if a date is selected
              <>
                {fetchingSlots ? (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left">Time</th>
                          <th className="px-4 py-2 text-left">Price</th>
                          <th className="px-4 py-2 text-left">Pitch</th>
                        </tr>
                      </thead>
                      <tbody>
                        {availableTimes.map((slot, index) => (
                          <tr
                            key={index}
                            className="border-t cursor-pointer hover:bg-gray-100"
                            onClick={() => handleRowClick(slot.startTime)}
                          >
                            <td className="px-4 py-2">{slot.startTime} - {slot.endTime}</td>
                            <td className="px-4 py-2">Rs{futsal.pricePerHour}</td>
                            <td className="px-4 py-2">
                              {slot.status === "available" ? (
                                <FaCheckCircle className="text-green-500" />
                              ) : slot.status === "booked" ? (
                                <FaTimesCircle className="text-red-500" />
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {fetchError && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
                    <FaExclamationCircle className="text-red-600" />
                    {fetchError}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Side: Booking Details and Cart */}
        <div className="w-1/2 p-8">
          {/* Futsal Details */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
            <div className="flex items-center gap-4">
              {futsal.images?.length > 0 && (
                <img
                  src={`http://localhost:8000/${futsal.images[0]}`}
                  alt={futsal.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div>
                <h3 className="text-xl font-semibold">{futsal.name}</h3>
                <p className="text-sm flex items-center mt-1">
                  <FaMapMarkerAlt className="text-red-500 mr-2" /> {futsal.location || "Unknown City"}
                </p>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <FaStar className="text-yellow-500 mr-1" />
                  {futsal.avgRating && futsal.avgRating !== "No ratings" ? (
                    `${futsal.avgRating} (${futsal.reviewCount || 0} review${futsal.reviewCount === 1 ? "" : "s"})`
                  ) : (
                    "No reviews yet"
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Selected Date and Time */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Selected Slot</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                Date: <span className="font-semibold">{selectedDate ? formatDate(selectedDate) : "Not selected"}</span>
              </p>
              <p className="text-gray-700">
                Time:{" "}
                <span className="font-semibold">
                  {selectedStartTime && selectedEndTime
                    ? `${selectedStartTime} - ${selectedEndTime}`
                    : "Not selected"}
                </span>
              </p>
            </div>
          </div>

          {/* Total Amount */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Total Amount</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <span className="font-semibold">Rs{calculateTotalAmount()}</span>
              </p>
            </div>
          </div>

          {/* Confirm Booking Button */}
          <button
            onClick={handleBookingConfirmation}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all duration-200"
            disabled={loading}
          >
            {loading ? "Booking..." : <><FaCheckCircle /> Confirm Booking</>}
          </button>

          {/* Booking Confirmation Message */}
          {bookingConfirmed && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
              <FaCheckCircle className="text-green-600" />
              Booking confirmed!
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
              <FaExclamationCircle className="text-red-600" />
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookArena;
