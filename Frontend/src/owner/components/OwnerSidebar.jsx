import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaFutbol,
  FaBook,
  FaMoneyBill,
  FaStar,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { logout } from "../../features/user/userSlice";
import { useDispatch } from "react-redux";

const OwnerSidebar = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-gray-800 shadow-md flex flex-col p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-100 mb-8">Owner Panel</h2>
      <nav className="flex-1">
        <ul>
          <li className="mb-3">
            <Link
              to="/"
              className="flex items-center gap-3 p-3 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition"
            >
              <FaTachometerAlt className="text-gray-400" /> Dashboard
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/owner/futsal"
              className="flex items-center gap-3 p-3 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition"
            >
              <FaFutbol className="text-gray-400" /> Futsal
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/owner/bookings"
              className="flex items-center gap-3 p-3 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition"
            >
              <FaBook className="text-gray-400" /> Bookings
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/owner/payments"
              className="flex items-center gap-3 p-3 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition"
            >
              <FaMoneyBill className="text-gray-400" /> Payments
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/owner/reviews"
              className="flex items-center gap-3 p-3 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition"
            >
              <FaStar className="text-gray-400" /> Reviews
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/owner/profile"
              className="flex items-center gap-3 p-3 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition"
            >
              <FaUser className="text-gray-400" /> Profile
            </Link>
          </li>
        </ul>
      </nav>
      <button
        onClick={handleLogout}
        className="mt-6 flex items-center gap-3 p-3 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default OwnerSidebar;
