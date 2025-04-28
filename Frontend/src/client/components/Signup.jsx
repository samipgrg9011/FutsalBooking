// import React, { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import futsalimage from "../../image/wallpaper04.jpg"; // Same image as Login

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     Email: "",
//     password: "",
//     ConfirmPassword: "",
//     FirstName: "",
//     LastName: "",
//     address: "",
//     phoneNumber: "",
//   });
//   const [errorMessage, setErrorMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSignupSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage("");
//     setLoading(true);

//     if (formData.password !== formData.ConfirmPassword) {
//       setErrorMessage("Passwords do not match.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:8000/api/signup", {
//         FirstName: formData.FirstName,
//         LastName: formData.LastName,
//         Email: formData.Email,
//         password: formData.password,
//         address: formData.address,
//         phoneNumber: formData.phoneNumber,
//       });

//       if (response.status === 200) {
//         alert("Signup successful! Please Login");
//         setFormData({
//           Email: "",
//           password: "",
//           ConfirmPassword: "",
//           FirstName: "",
//           LastName: "",
//           address: "",
//           phoneNumber: "",
//         });
//         navigate("/login");
//       }
//     } catch (error) {
//       if (error.response?.data?.error) {
//         setErrorMessage("Email already exists");
//       } else if (error.response?.data?.errors) {
//         const firstError = error.response.data.errors[0];
//         if (firstError.params === "FirstName" || firstError.params === "LastName") {
//           setErrorMessage("Names must be at least 3 characters");
//         } else if (firstError.params === "password") {
//           setErrorMessage("Password must be at least 8 characters");
//         } else if (firstError.params === "Email") {
//           setErrorMessage("Please enter a valid email address.");
//         } else if (firstError.params === "phoneNumber") {
//           setErrorMessage("Phone number is already in use.");
//         } else {
//           setErrorMessage("An error occurred. Please try again.");
//         }
//       } else {
//         setErrorMessage(error.response?.data?.msg || "An error occurred. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="container mx-auto max-w-screen-xl px-6 lg:px-6">
//         <div className="w-full bg-white rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden">
//           {/* Form Section */}
//           <div className="w-full md:w-1/2 p-6 md:p-8">
//             <h2 className="text-2xl font-bold text-green-600 mb-4 text-center pt-4">Join the Futsal Community</h2>
//             <p className="text-gray-600 mb-6 text-base text-center">Sign up to start your futsal journey</p>

//             {errorMessage && (
//               <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-base">
//                 {errorMessage}
//               </div>
//             )}

//             <form onSubmit={handleSignupSubmit} className="space-y-5">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="firstName" className="block text-gray-600 text-sm mb-1">
//                     First Name
//                   </label>
//                   <input
//                     type="text"
//                     id="firstName"
//                     value={formData.FirstName}
//                     onChange={(e) => setFormData({ ...formData, FirstName: e.target.value })}
//                     className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none bg-gray-50 text-base"
//                     required
//                     aria-describedby="firstName"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="lastName" className="block text-gray-600 text-sm mb-1">
//                     Last Name
//                   </label>
//                   <input
//                     type="text"
//                     id="lastName"
//                     value={formData.LastName}
//                     onChange={(e) => setFormData({ ...formData, LastName: e.target.value })}
//                     className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none bg-gray-50 text-base"
//                     required
//                     aria-describedby="lastName"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="email" className="block text-gray-600 text-sm mb-1">
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     id="email"
//                     value={formData.Email}
//                     onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
//                     className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none bg-gray-50 text-base"
//                     required
//                     aria-describedby="email"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="phoneNumber" className="block text-gray-600 text-sm mb-1">
//                     Phone Number
//                   </label>
//                   <input
//                     type="text"
//                     id="phoneNumber"
//                     value={formData.phoneNumber}
//                     onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
//                     className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none bg-gray-50 text-base"
//                     aria-describedby="phoneNumber"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="address" className="block text-gray-600 text-sm mb-1">
//                   Address
//                 </label>
//                 <input
//                   type="text"
//                   id="address"
//                   value={formData.address}
//                   onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                   className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none bg-gray-50 text-base"
//                   aria-describedby="address"
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="password" className="block text-gray-600 text-sm mb-1">
//                     Password
//                   </label>
//                   <input
//                     type="password"
//                     id="password"
//                     value={formData.password}
//                     onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                     className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none bg-gray-50 text-base"
//                     required
//                     aria-describedby="password"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="confirmPassword" className="block text-gray-600 text-sm mb-1">
//                     Confirm Password
//                   </label>
//                   <input
//                     type="password"
//                     id="confirmPassword"
//                     value={formData.ConfirmPassword}
//                     onChange={(e) => setFormData({ ...formData, ConfirmPassword: e.target.value })}
//                     className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none bg-gray-50 text-base"
//                     required
//                     aria-describedby="confirmPassword"
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-green-600 text-white py-3 rounded-lg disabled:opacity-50 shadow-md text-base font-medium"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center">

//                     Signing up...
//                   </span>
//                 ) : (
//                   "Sign Up"
//                 )}
//               </button>
//             </form>

//             <p className="mt-6 text-center text-base text-gray-600">
//               Already have an account?{" "}
//               <Link to="/login" className="text-green-600 font-medium">
//                 Sign in
//               </Link>
//             </p>
//           </div>

//           {/* Hero Image Section */}
//           <div className="w-full md:w-1/2 relative overflow-hidden hidden md:block">
//             <div className="relative h-full w-full">
//               <img
//                 src={futsalimage}
//                 alt="People playing futsal"
//                 className="object-cover w-full h-full transform hover:scale-105 transition duration-700"
//                 loading="lazy"
//               />
//               <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-8 text-center">
//                 <h3 className="text-white text-2xl md:text-3xl font-bold mb-4 drop-shadow-lg">
//                   Elevate Your Game
//                 </h3>
//                 <p className="text-gray-100 text-sm md:text-base max-w-md mb-6">
//                   Connect with players, book courts, and join tournaments in your area
//                 </p>

//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import futsalimage from "../../image/wallpaper04.jpg"; 
import { ToastContainer, toast } from 'react-toastify';


const Signup = () => {
  const [formData, setFormData] = useState({
    Email: "",
    password: "",
    ConfirmPassword: "",
    FirstName: "",
    LastName: "",
    address: "",
    phoneNumber: "",
    role: "", // No default role
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    // Validate password match
    if (formData.password !== formData.ConfirmPassword) {
      setErrorMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Validate role selection
    if (!formData.role) {
      setErrorMessage("Please select a role.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/signup", {
        FirstName: formData.FirstName,
        LastName: formData.LastName,
        Email: formData.Email,
        password: formData.password,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        role: formData.role, // Include role in API call
      });

      if (response.status === 200) {
        // toast.success("Signup successful! Please Login");
        alert("Signup successful! Please Login");

        setFormData({
          Email: "",
          password: "",
          ConfirmPassword: "",
          FirstName: "",
          LastName: "",
          address: "",
          phoneNumber: "",
          role: "",
        });
        // setTimeout(() => {
        //   navigate("/login");
        // }, 3000); 
        navigate("/login");
      }
    } catch (error) {
      if (error.response?.data?.error) {
        setErrorMessage("Email already exists");
      } else if (error.response?.data?.errors) {
        const firstError = error.response.data.errors[0];
        if (firstError.params === "FirstName" || firstError.params === "LastName") {
          setErrorMessage("Names must be at least 3 characters");
        } else if (firstError.params === "password") {
          setErrorMessage("Password must be at least 8 characters");
        } else if (firstError.params === "Email") {
          setErrorMessage("Please enter a valid email address.");
        } else if (firstError.params === "phoneNumber") {
          setErrorMessage("Phone number is already in use.");
        } else if (firstError.params === "role") {
          setErrorMessage("Invalid role selected.");
        } else {
          setErrorMessage("An error occurred. Please try again.");
        }
      } else {
        setErrorMessage(error.response?.data?.msg || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <ToastContainer/>
      <div className="container mx-auto max-w-screen-xl px-6 lg:px-6">
        <div className="w-full bg-white rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden">
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-green-600 mb-4 text-center pt-4">Join the Futsal Community</h2>
            <p className="text-gray-600 mb-6 text-base text-center">Sign up to start your futsal journey</p>

            {errorMessage && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-base">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSignupSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-gray-600 text-sm mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.FirstName}
                    onChange={(e) => setFormData({ ...formData, FirstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none bg-gray-50 text-base"
                    required
                    aria-describedby="firstName"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-gray-600 text-sm mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.LastName}
                    onChange={(e) => setFormData({ ...formData, LastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none bg-gray-50 text-base"
                    required
                    aria-describedby="lastName"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-gray-600 text-sm mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.Email}
                    onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none bg-gray-50 text-base"
                    required
                    aria-describedby="email"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-gray-600 text-sm mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none bg-gray-50 text-base"
                    aria-describedby="phoneNumber"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-gray-600 text-sm mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none bg-gray-50 text-base"
                  aria-describedby="address"
                  disabled={loading}
                />
              </div>

              {/* Role Selector */}
              <div>
                <label className="block text-gray-600 text-sm mb-2">Select Role</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={formData.role === "user"}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      required
                      disabled={loading}
                    />
                    <span className="text-gray-600 text-base">User</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="role"
                      value="owner"
                      checked={formData.role === "owner"}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      required
                      disabled={loading}
                    />
                    <span className="text-gray-600 text-base">Owner</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-gray-600 text-sm mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none bg-gray-50 text-base"
                    required
                    aria-describedby="password"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-gray-600 text-sm mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.ConfirmPassword}
                    onChange={(e) => setFormData({ ...formData, ConfirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none bg-gray-50 text-base"
                    required
                    aria-describedby="confirmPassword"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg disabled:opacity-50 shadow-md text-base font-medium"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    Signing up...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-base text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-green-600 font-medium">
                Sign in
              </Link>
            </p>
          </div>

          {/* Hero Image Section */}
          <div className="w-full md:w-1/2 relative overflow-hidden hidden md:block">
            <div className="relative h-full w-full">
              <img
                src={futsalimage}
                alt="People playing futsal"
                className="object-cover w-full h-full transform hover:scale-105 transition duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-8 text-center">
                <h3 className="text-white text-2xl md:text-3xl font-bold mb-4 drop-shadow-lg">
                  Elevate Your Game
                </h3>
                <p className="text-gray-100 text-sm md:text-base max-w-md mb-6">
                  Connect with players, book courts, and join tournaments in your area
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;