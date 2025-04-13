import { Link } from "react-router-dom";
import { FaTachometerAlt, FaFutbol, FaBook, FaSignOutAlt } from "react-icons/fa";
import { logout } from "../../features/user/userSlice";
import { useDispatch } from 'react-redux';

const OwnerSidebar = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-5">
      <h2 className="text-xl font-bold mb-6">Owner Panel</h2>
      <nav className="flex-1">
        <ul>
          <li className="mb-4">
            <Link to="/owner/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700">
              <FaTachometerAlt /> Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/owner/futsal" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700">
              <FaFutbol /> Futsal
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/owner/bookings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700">
              <FaBook /> Bookings
            </Link>
          </li>
        </ul>
      </nav>
      <button onClick={handleLogout} className="mt-auto flex items-center gap-3 p-3 rounded-lg bg-red-600 hover:bg-red-700">
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default OwnerSidebar;
