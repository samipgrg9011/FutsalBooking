import { useEffect, useState } from "react";
import axios from "axios";

const LoggedUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/logged-in-users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => setUsers(response.data.loggedInUsers))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="p-6 lg:ml-auto bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Logged-in Users</h2>

      <div className="bg-white shadow-lg rounded-lg p-4 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="px-6 py-3 text-left">User ID</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Logged In At</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-600">
                  No logged-in users
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-100 text-gray-800">
                  <td className="px-6 py-3">{user.id}</td>
                  <td className="px-6 py-3">{user.Email}</td>
                  <td className="px-6 py-3">{user.role}</td>
                  <td className="px-6 py-3">{new Date(user.loggedInAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoggedUsers;
