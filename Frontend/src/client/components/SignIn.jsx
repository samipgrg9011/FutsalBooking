

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../../features/user/userSlice";
import { useNavigate } from "react-router-dom";

const SignIn = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    Email: "",
    password: "",
    ConfirmPassword: "", // Added Confirm Password
    FirstName: "",
    LastName: "",
    address: "",
    phoneNumber:""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    // Password match validation
    if (!isLogin && formData.password !== formData.ConfirmPassword) {
      setErrorMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      let response;
      if (isLogin) {
        response = await axios.post("http://localhost:8000/api/login", {
          Email: formData.Email,
          password: formData.password,
        });

        if (response.status === 200) {
          console.log("User data: ", response.data.user);
          alert("Welcome");

          let user = response.data.user;
          localStorage.setItem("token", response.data.token);
          dispatch(login(user));

          // Redirect based on role
          if (user.role === "admin") {
            navigate("/admin");
          } else if (user.role === "owner") {
            navigate("/owner");
          } else {
            navigate("/");
          }
          onClose();
        }
      } else {
        response = await axios.post("http://localhost:8000/api/signup", {
          FirstName: formData.FirstName,
          LastName: formData.LastName,
          Email: formData.Email,
          password: formData.password,
          address: formData.address,
          phoneNumber: formData.phoneNumber
        });

        if (response.status === 200) {
          alert("Signup successful! Please Login");
          setIsLogin(true);
          setFormData({ Email: "", password: "", ConfirmPassword: "", FirstName: "", LastName: "" });
        }
      }
    } catch (error) {
      if (error.response?.data?.error) {
        setErrorMessage("Email already exists");
        return;
      }

      if (error.response?.data?.errors) {
        const firstError = error.response.data.errors[0];
        if (firstError.params === "FirstName" || firstError.params === "LastName") {
          setErrorMessage("Names must be at least 3 characters");
          return;
        }
        if (firstError.params === "password") {
          setErrorMessage("Password must be at least 8 characters");
          return;
        }
        if (firstError.params === "Email") {
          setErrorMessage("Please enter a valid email address.");
          return;
        } else if (err.params === "phoneNumber") {
          setErrorMessage("Phone number is already in use.");
        }
  
        
      }       

      setErrorMessage(error.response?.data?.msg || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = () => {
    setIsLogin(!isLogin);
    setErrorMessage("");

    // Reset all form fields when switching modes
    setFormData({
      Email: "",
      password: "",
      ConfirmPassword: "",
      FirstName: "",
      LastName: "",
      address: "",
      phoneNumber: "",
    });
  };
  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="p-6 max-w-lg w-full bg-white shadow-2xl rounded-lg relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-red-500 font-bold text-2xl">
          X
        </button>

        <h1 className="text-3xl text-center font-semibold my-7">
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

        <form className="flex flex-col gap-4" onSubmit={handleLoginSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="First Name"
                value={formData.FirstName}
                onChange={(e) => setFormData({ ...formData, FirstName: e.target.value })}
                className="border p-3 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.LastName}
                onChange={(e) => setFormData({ ...formData, LastName: e.target.value })}
                className="border p-3 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="border p-3 rounded-lg"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="border p-3 rounded-lg"
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={formData.Email}
            onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
            className="border p-3 rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="border p-3 rounded-lg"
            required
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.ConfirmPassword}
              onChange={(e) => setFormData({ ...formData, ConfirmPassword: e.target.value })}
              className="border p-3 rounded-lg"
              required
            />
          )}
          <button
            type="submit"
            className="bg-slate-600 text-white p-3 rounded-lg hover:opacity-90 disabled:opacity-80"
            disabled={loading}
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="flex gap-2 mt-5">
          <p>{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
          <span
            className="text-blue-800 hover:underline cursor-pointer"
            onClick={handleModeSwitch}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
