// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AllUsersForAdmin = () => {
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get("http://localhost:8000/api/admin/allusers", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });

//         setUsers(response.data.users || []);
//         setError(null);
//       } catch (err) {
//         console.error("Error fetching users:", err);
//         setError("Failed to load users");
//       }
//     };

//     fetchUsers();
//   }, []);

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-8">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">All Users</h2>

//       {users.length === 0 ? (
//         <div className="text-center py-10 text-gray-500">
//           {error || "No users found"}
//         </div>
//       ) : (
//         <div className="overflow-x-auto shadow-md rounded-lg">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {users.map((user) => (
//                 <tr key={user._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.FirstName}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.LastName}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.Email}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.role}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.phoneNumber || "N/A"}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.address || "N/A"}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                     {new Date(user.createdAt).toLocaleString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllUsersForAdmin;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllUsersForAdmin = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    totalUsers: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 5,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({
    sortBy: 'createdAt', // Fixed to 'createdAt'
    sortOrder: 'desc',
  });
  const [page, setPage] = useState(1);
  const [role, setRole] = useState(''); // Default role is '' (All)

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/admin/allusers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search,
          ...sort,
          page,
          limit: pagination.limit,
          role,
        },
      });

      setUsers(response.data.users || []);
      setPagination(response.data.pagination);
      setLoading(false);
      setError(response.data.users.length === 0 && (search || role) ? 'No users found for your search or role.' : null);
    } catch (err) {
      console.error('Error fetching users:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Error fetching users');
      setLoading(false);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, sort, role]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleSortOrderChange = (e) => {
    setSort({ ...sort, sortOrder: e.target.value });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setPage(1); // Reset to first page when role changes
  };

  if (loading) {
    return (
      <div className="text-center text-teal-400 font-semibold">Loading...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Users</h2>

      {/* Search, Role Filter, and Sort Controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <form onSubmit={handleSearch} className="flex-grow flex gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by username "
            className="px-4 py-2 border rounded-md flex-grow"
          />
          <select
            value={role}
            onChange={handleRoleChange}
            className="px-4 py-2 border rounded-md"
          >
            <option value="">All</option>
            <option value="user">User</option>
            <option value="owner">Owner</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Search
          </button>
        </form>
        <div className="flex gap-4 items-center">
          <span className="text-sm text-gray-600">Sort by Created At:</span>
          <select
            value={sort.sortOrder}
            onChange={handleSortOrderChange}
            className="px-4 py-2 border rounded-md"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {(error || users.length === 0) && (
        <div className="text-center py-10 text-red-500">
          {error || 'No users found'}
        </div>
      )}

      {/* Table and Pagination (only shown if users exist) */}
      {users.length > 0 && (
        <>
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    First Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {user.FirstName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {user.LastName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {user.Email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {user.role || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {user.phoneNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {user.address || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace बार text-sm text-gray-700">
                      {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Showing {users.length} of {pagination.totalUsers} users
            </div>
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AllUsersForAdmin;