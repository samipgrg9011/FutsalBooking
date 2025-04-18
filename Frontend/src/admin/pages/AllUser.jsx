import { useEffect, useState } from "react";
import axios from "axios";

const AllUsersForAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get("http://localhost:8000/api/admin/allusers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(response.data.users);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        if (err.response && err.response.status === 403) {
          setError("Access denied. Admins only.");
        } else {
          setError(err.response?.data?.message || "Failed to fetch users.");
        }
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="p-6 lg:ml-auto bg-gray-100 min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:ml-auto bg-gray-100 min-h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:ml-auto bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Users</h2>

      <div className="bg-white shadow-lg rounded-lg p-4 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="px-6 py-3 text-left">First Name</th>
              <th className="px-6 py-3 text-left">Last Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Phone Number</th>
              <th className="px-6 py-3 text-left">Address</th>
              <th className="px-6 py-3 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-600">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-100 text-gray-800"
                >
                  <td className="px-6 py-3">{user.FirstName}</td>
                  <td className="px-6 py-3">{user.LastName}</td>
                  <td className="px-6 py-3">{user.Email}</td>
                  <td className="px-6 py-3">{user.role}</td>
                  <td className="px-6 py-3">
                    {user.phoneNumber || "N/A"}
                  </td>
                  <td className="px-6 py-3">{user.address || "N/A"}</td>
                  <td className="px-6 py-3">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsersForAdmin;