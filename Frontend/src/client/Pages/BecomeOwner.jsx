import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/user/userSlice"; // Redux action to update user state

const BecomeOwner = () => {
  const [formData, setFormData] = useState({
    ownerName: "",
    location: "",
    contactInfo: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to become an owner.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/become-owner",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Full Response Data:", response.data); // Debugging log
  
      if (response.status === 200) {
        alert("Congratulations! You are now an owner.");
        
        const { updatedUser, token: newToken } = response.data;
  
        if (!updatedUser) {
          throw new Error("User data not received from server.");
        }
  
        // Update Redux state with updated user data
        dispatch(setUser(updatedUser));
  
        // Store new token
        if (newToken) {
          localStorage.setItem("token", newToken);
        }
  
        // Navigate to the profile page for review or edit after becoming an owner
        navigate("/owner");
      }
    } catch (error) {
      console.error("Error in BecomeOwner:", error);
      setError(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center">Become an Owner</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Owner Name"
          value={formData.ownerName}
          onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
          className="border p-3 rounded-lg"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="border p-3 rounded-lg"
          required
        />
        
        <input
          type="text"
          placeholder="Contact number"
          value={formData.contactInfo}
          onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
          className="border p-3 rounded-lg"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-lg disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default BecomeOwner;
