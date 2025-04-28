import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../../features/user/userSlice";
import { useNavigate, Link } from "react-router-dom";
import futsalimage from "../../image/futsalsignup.jpg"; 
import { ToastContainer, toast } from 'react-toastify';


const Login = () => {
  const [formData, setFormData] = useState({
    Email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        Email: formData.Email,
        password: formData.password,
      });

      if (response.status === 200) {
        console.log("User data: ", response.data.user);
        // toast.success("Welcome");
        alert("Welcome");

     


        let user = response.data.user;
        localStorage.setItem("token", response.data.token);
        dispatch(login(user));

        // setTimeout(() => {
        //   if (user.role === "admin") {
        //     navigate("/admin");
        //   } else if (user.role === "owner") {
        //     navigate("/owner");
        //   } else {
        //     navigate("/");
        //   }
        // }, 2000); 
      

        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "owner") {
          navigate("/owner");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      if (error.response?.data?.error) {
        setErrorMessage("Invalid email or password");
      } else if (error.response?.data?.errors) {
        const firstError = error.response.data.errors[0];
        if (firstError.params === "Email") {
          setErrorMessage("Please enter a valid email address.");
        } else if (firstError.params === "password") {
          setErrorMessage("Password must be at least 8 characters");
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
            <h2 className="text-2xl font-bold text-green-600 mb-4 text-center pt-4">Welcome Back</h2>
            <p className="text-gray-600 mb-6 text-base">Sign in to continue your futsal journey</p>

            {errorMessage && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-base">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-600 text-sm mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.Email}
                  onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none bg-gray-50 text-base"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-600 text-sm mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none bg-gray-50 text-base"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-base text-gray-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-green-600 rounded"
                  />
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className="text-base text-green-600 font-medium"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg disabled:opacity-50 shadow-md text-base font-medium"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-base text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-green-600 font-medium">
                Sign up
              </Link>
            </p>
          </div>

          {/* Image Section */}
          <div className="w-full md:w-1/2 relative hidden md:block border-l border-gray-200">
            <img
              src={futsalimage}
              alt="Futsal Background"
              className="object-cover w-full h-full"
            />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-12">
            <div className="text-center px-8">
              <h3 className="text-white text-2xl font-bold mb-3">Join the Futsal Community Today</h3>
              <p className="text-gray-200 text-sm font-medium">Connect with players and venues near you</p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;