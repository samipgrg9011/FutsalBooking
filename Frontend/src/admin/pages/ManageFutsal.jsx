import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageFutsal = () => {
  const [futsals, setFutsals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFutsals = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/futsals', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFutsals(response.data.futsals);
      setLoading(false);
    } catch (err) {
      setError('Error fetching futsals');
      setLoading(false);
    }
  };

  const handleDelete = async (futsalId) => {
    try {
      await axios.delete(`http://localhost:8000/api/futsals/${futsalId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFutsals(futsals.filter(futsal => futsal._id !== futsalId));
    } catch (err) {
      setError('Error deleting futsal');
    }
  };

  useEffect(() => {
    fetchFutsals();
  }, []);

  if (loading) return <div className="text-center text-teal-400 font-semibold">Loading...</div>;

  return (
    <div className="ml-auto p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Manage Futsals</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-teal-500 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Owner</th>
              <th className="py-3 px-4 text-left">Price Per Hour</th>
              <th className="py-3 px-4 text-left">Location</th>
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {futsals.map(futsal => (
              <tr key={futsal._id} className="border-t border-gray-200">
                <td className="py-3 px-4">{futsal.name}</td>
                <td className="py-3 px-4">
                  {futsal.createdBy && futsal.createdBy.FirstName && futsal.createdBy.LastName
                    ? `${futsal.createdBy.FirstName} ${futsal.createdBy.LastName}`
                    : 'Unknown'}
                </td>
                <td className="py-3 px-4">Rs{futsal.pricePerHour}</td>
                <td className="py-3 px-4">{futsal.location}</td>
                <td className="py-3 px-4">
                  {futsal.images && futsal.images.length > 0 ? (
                    <img
                      src={`http://localhost:8000/${futsal.images[0]}`} // Use only the first image
                      alt={`Futsal ${futsal.name}`}
                      className="w-16 h-16 object-cover rounded-md shadow-md"
                    />
                  ) : (
                    <span>No image available</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDelete(futsal._id)}
                    className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageFutsal;