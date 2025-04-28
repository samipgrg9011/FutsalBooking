

// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../../features/user/userSlice";


// const Header = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Get user from Redux
//   const user = useSelector((state) => state.user.user);

//   const handleLogout = () => {
//     dispatch(logout());
//     localStorage.removeItem("token");
//     setIsDropdownOpen(false);
//     navigate("/"); // Redirect to home page after logout
//   };

//   return (
//     <header className="bg-white">
//       <div className="container mx-auto max-w-screen-xl px-6 lg:px-6 py-6 flex justify-between items-center">
//         <Link to="/">
//           <h1 className="font-bold text-[23px] text-green-600">FutsalHub</h1>
//         </Link>

//         <ul className="hidden md:flex gap-6 text-gray-700 font-medium text-lg">
//           <Link to="/" className="hover:text-gray-900">
//             <li>Home</li>
//           </Link>
//           <Link to="/findfutsalcourts" className="hover:text-gray-900">
//             <li>Find Courts</li>
//           </Link>
//           <Link to="/mybooking" className="hover:text-gray-900">
//             <li>For Vendors</li>
//           </Link>
//           <Link to="/about" className="hover:text-gray-900">
//             <li>About Us</li>
//           </Link>
//         </ul>

//         <div className="flex items-center gap-4">
         

//           {user ? (
//             <div className="relative">
//               <button
//                 className="font-medium text-gray-700 hover:text-gray-900 text-lg"
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               >
//                 {`${user.FirstName} ${user.LastName}`}
//               </button>
//               {isDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
//                   <ul className="py-2 text-lg">
//                     <li>
//                       <Link
//                         to="/UserProfile"
//                         className="block px-4 py-2 hover:bg-gray-100"
//                         onClick={() => setIsDropdownOpen(false)}
//                       >
//                         Profile
//                       </Link>
//                     </li>
//                     <li>
//                       <Link
//                         to="/mybooking"
//                         className="block px-4 py-2 hover:bg-gray-100"
//                         onClick={() => setIsDropdownOpen(false)}
//                       >
//                         My Booking
//                       </Link>
//                     </li>
//                     <li>
//                       <button
//                         onClick={handleLogout}
//                         className="w-full text-left px-4 py-2 hover:bg-gray-100"
//                       >
//                         Logout
//                       </button>
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="flex gap-4">
//               <Link
//                 to="/login"
//                 className="font-medium text-gray-700 hover:text-gray-900 text-lg"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/signup"
//                 className="font-medium text-gray-700 hover:text-gray-900 text-lg"
//               >
//                 Sign Up
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/user/userSlice";
import { FaUserCircle } from "react-icons/fa"; // Import the profile icon
// import { ToastContainer, toast } from 'react-toastify';


const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user from Redux
  const user = useSelector((state) => state.user.user);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    setIsDropdownOpen(false);
    navigate("/");
    // toast.error("You have logged out!");
    // setTimeout(() => {
    //   navigate("/");
    // }, 2000); // 2 seconds delay

  };

  return (
    <header className="bg-white">
      {/* <ToastContainer/> */}
      <div className="container mx-auto max-w-screen-xl px-6 lg:px-6 py-6 flex justify-between items-center">
        <Link to="/">
          <h1 className="font-bold text-[23px] text-green-600">FutsalHub</h1>
        </Link>

        <ul className="hidden md:flex gap-6 text-gray-700 font-medium text-lg">
          <Link to="/" className="hover:text-gray-900">
            <li>Home</li>
          </Link>
          <Link to="/findfutsalcourts" className="hover:text-gray-900">
            <li>Find Courts</li>
          </Link>
          {/* <Link to="/mybooking" className="hover:text-gray-900">
            <li>For Vendors</li>
          </Link> */}
          <Link to="/about" className="hover:text-gray-900">
            <li>About Us</li>
          </Link>
        </ul>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                className="flex items-center font-medium text-gray-700 hover:text-gray-900 text-lg"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <FaUserCircle className="mr-2" /> {/* Profile icon */}
                {`${user.FirstName} ${user.LastName}`}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <ul className="py-2 text-lg">
                    <li>
                      <Link
                        to="/UserProfile"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/mybooking"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
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
            <div className="flex gap-4">
              <Link
                to="/login"
                className="font-medium text-gray-700 hover:text-gray-900 text-lg"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="font-medium text-gray-700 hover:text-gray-900 text-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;