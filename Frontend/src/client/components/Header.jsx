

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/user/userSlice";
import SignIn from "./SignIn";
import { useNavigate } from "react-router-dom";


const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  // Get user from Redux or localStorage
  const user = useSelector((state) => state.user.user) 
  // || JSON.parse(localStorage.getItem("user"));

  const handleSignInModal = () => {
    if (user) {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    setIsDropdownOpen(false);
    navigate('/'); // Redirect to home page after logout

  };
  return (
    <>
      <header className="bg-white  ">
        <div className="container mx-auto max-w-screen-xl px-6 lg:px-6 py-6 flex justify-between items-center">
          <Link to="/">
            <h1 className="font-bold text-[20px] text-green-600">FutsalHub</h1>
          </Link>

          <ul className="hidden md:flex gap-6 text-gray-700 font-medium text-lg">
            <Link to="/" className="hover:text-gray-900"><li>Home</li></Link>
            <Link to="/findfutsalcourts" className="hover:text-gray-900"><li>Find Courts</li></Link>
            <Link to="/mybooking" className="hover:text-gray-900"><li>For Vendors</li></Link>
            <Link to="/about" className="hover:text-gray-900"><li>About Us</li></Link>
          </ul>

          <div className="flex items-center gap-4">
            <Link to="/becomeowner" className="text-gray-700 font-medium hover:text-gray-900 text-lg">
              Become Owner
            </Link>

            {user ? (
              <div className="relative">
                <button
                  className="font-medium text-gray-700 hover:text-gray-900 text-lg"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {`${user.FirstName} ${user.LastName}`}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <ul className="py-2 text-lg">
                      <li>
                        <Link to="/UserProfile" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link to="/mybooking" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>
                          My Booking
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <button className="font-medium text-gray-700 hover:text-gray-900 text-lg" onClick={handleSignInModal}>
                Login
              </button>
            )}
          </div>
        </div>
      </header>
      {isModalOpen && <SignIn onClose={handleCloseModal} />}
    </>
  );
};

export default Header;
