import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateUser } from "../../features/user/userSlice";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    phoneNumber: "",
    password: "",
  });
  const [image, setImage] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/profile", {
          headers: { Authorization: token },
        });
        const u = res.data.user;
        setUser(u);
        setFormData({
          FirstName: u.FirstName || "",
          LastName: u.LastName || "",
          Email: u.Email || "",
          phoneNumber: u.phoneNumber || "",
          password: "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch user profile");
      }
    };

    fetchUser();
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:8000/api/update/profile",
        formData,
        { headers: { Authorization: token } }
      );
      toast.success(res.data.msg);
      dispatch(updateUser({ ...formData }));
      setIsEditing(false); // Exit edit mode after successful update
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error;
      toast.error(
        errorMsg?.includes("Email") ? "Email is already in use." :
        errorMsg?.includes("Phone") ? "Phone number is already in use." :
        "Failed to update profile. Please try again."
      );
    }
  };

  const handleImageUpload = async () => {
    if (!image) return;
    const form = new FormData();
    form.append("image", image);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/profile/image",
        form,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(res.data.msg);
      setUser((prev) => ({ ...prev, profileImage: res.data.profileImage }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      FirstName: user.FirstName || "",
      LastName: user.LastName || "",
      Email: user.Email || "",
      phoneNumber: user.phoneNumber || "",
      password: "",
    });
    setIsEditing(false);
  };

  if (!user) return <div className="flex justify-center items-center min-h-screen">Loading profile...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Profile Card */}
        <div className="lg:w-1/3 bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="relative mx-auto w-32 h-32 mb-4">
              <img
                src={`http://localhost:8000/${user.profileImage}`}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-4 border-gray-200"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {`${formData.FirstName} ${formData.LastName}`}
            </h3>
            <div className="space-y-3">
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <button
                onClick={handleImageUpload}
                disabled={!image}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Upload Image
              </button>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="lg:w-2/3 bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Account Settings</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="FirstName"
                  value={formData.FirstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="LastName"
                  value={formData.LastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                />
              </div>
            </div>

            {isEditing && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserProfile;