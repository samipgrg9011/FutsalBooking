import { Link } from "react-router-dom";
import { 
  FaGauge, 
  FaUserGroup, 
  FaCalendarCheck, 
  FaArrowRightFromBracket, 
  FaUsers, 
  FaFutbol, 
  FaMoneyBillWave, 
  FaStar, 
  FaChartBar
} from "react-icons/fa6";
import { useDispatch } from 'react-redux';
import { logout } from "../../features/user/userSlice";

const AdminSidebar = () => {
  const dispatch = useDispatch();
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  return (
    <div className="w-72 h-screen bg-gray-800 text-white flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-semibold text-teal-400">
          Admin Panel
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          <li>
            <Link 
              to="/admin/dashboard" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <FaGauge className="text-teal-300" size={20} />
              <span className="font-medium">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/owners" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <FaUserGroup className="text-teal-300" size={20} />
              <span className="font-medium">Owners</span>
            </Link>
          </li>
        
        
          <li>
            <Link  
              to="/admin/users" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <FaUsers className="text-teal-300" size={20} />
              <span className="font-medium">Users</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/arenas" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <FaFutbol className="text-teal-300" size={20} />
              <span className="font-medium">Arenas</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/payments" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <FaMoneyBillWave className="text-teal-300" size={20} />
              <span className="font-medium">Payments</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/reviews" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <FaStar className="text-teal-300" size={20} />
              <span className="font-medium">Reviews</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/reports" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <FaChartBar className="text-teal-300" size={20} />
              <span className="font-medium">Reports</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
        >
          <FaArrowRightFromBracket className="text-white" size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;