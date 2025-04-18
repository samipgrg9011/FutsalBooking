import { Link } from "react-router-dom";
import {
  FaGauge,
  FaUserGroup,
  FaUsers,
  FaFutbol,
  FaMoneyBillWave,
  FaStar,
  FaChartBar,
  FaArrowRightFromBracket
} from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { logout } from "../../features/user/userSlice";

const AdminSidebar = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="w-64 h-screen bg-gray-800 shadow-md flex flex-col p-6 fixed top-0 left-0 overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-100 mb-8">Admin Panel</h2>
      <nav className="flex-1">
        <ul>
          <li className="mb-3">
            <Link
              to="/"
              className="flex items-center gap-3 p-3 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition"
            >
              <FaGauge className="text-gray-400" /> Dashboard
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/admin/users"
              className="flex items-center gap-3 p-3 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition"
            >
              <FaUserGroup className="text-gray-400" /> Users
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/admin/arenas"
              className="flex items-center gap-3 p-3 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition"
            >
              <FaUsers className="text-gray-400" /> Arenas
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/admin/bookings"
              className="flex items-center gap-3 p-3 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition"
            >
              <FaFutbol className="text-gray-400" /> Bookings
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/admin/payments"
              className="flex items-center gap-3 p-3 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition"
            >
              <FaMoneyBillWave className="text-gray-400" /> Payments
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/admin/reviews"
              className="flex items-center gap-3 p-3 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition"
            >
              <FaStar className="text-gray-400" /> Reviews
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/admin/reports"
              className="flex items-center gap-3 p-3 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition"
            >
              <FaChartBar className="text-gray-400" /> Reports
            </Link>
          </li>
        </ul>
      </nav>
      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 p-3 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
      >
        <FaArrowRightFromBracket /> Logout
      </button>
    </div>
  );
};

export default AdminSidebar;
