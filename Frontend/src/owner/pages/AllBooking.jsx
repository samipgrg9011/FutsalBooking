import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";

const AllBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  // Fetch bookings when the component mounts
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/owner/bookings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setBookings(response.data.bookings || []);
        setError(null); // Clear errors if the request is successful
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings"); // Only set an error if the request fails
      }
    };

    fetchBookings();
  }, []);

  // Handle deleting a booking
  const deleteBooking = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8000/api/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setBookings((prev) => prev.filter((booking) => booking._id !== id));
      alert("Booking deleted successfully");
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Failed to delete booking");
    }
  };

  return (
    <div className="p-6 lg:ml-auto bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">All Bookings</h1>

      <div className="bg-white shadow-lg rounded-lg p-4 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="px-6 py-3 text-left">Booking ID</th>
              <th className="px-6 py-3 text-left">Futsal Arena</th>
              <th className="px-6 py-3 text-left">User</th>
              <th className="px-6 py-3 text-left">Booking Date</th>
              <th className="px-6 py-3 text-left">Start Time</th>
              <th className="px-6 py-3 text-left">End Time</th>
              <th className="px-6 py-3 text-left">Total Amount</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-600">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-gray-100 text-gray-800">
                  <td className="px-6 py-3">{booking._id}</td>
                  <td className="px-6 py-3">{booking.futsalArena ? booking.futsalArena.name : "N/A"}</td>
                  <td className="px-6 py-3">
                    {booking.user ? `${booking.user.FirstName} ${booking.user.LastName}` : "N/A"}
                  </td>
                  <td className="px-6 py-3">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td className="px-6 py-3">{booking.startTime}</td>
                  <td className="px-6 py-3">{booking.endTime}</td>
                  <td className="px-6 py-3">{booking.totalAmount}</td>
                  <td className="px-6 py-3 text-center">
                    <button
                      className="text-red-600 hover:text-red-800 p-2"
                      onClick={() => deleteBooking(booking._id)}
                    >
                      <FaTrashAlt size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllBooking;
