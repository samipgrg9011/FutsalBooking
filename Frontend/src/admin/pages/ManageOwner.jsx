// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ManageOwner = () => {
//   const [owners, setOwners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [newOwner, setNewOwner] = useState({
//     FirstName: "",
//     LastName: "",
//     email: "",
//     password: "",
//   });
//   const [successMsg, setSuccessMsg] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");
//   const [modalOpen, setModalOpen] = useState(false);

//   useEffect(() => {
//     const fetchOwners = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("http://localhost:8000/api/owners", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setOwners(response.data);
//       } catch (err) {
//         setError("Failed to fetch owners");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOwners();
//   }, []);

//   const handleDelete = async (userId) => {
//     const confirmed = window.confirm("Are you sure you want to delete this owner?");
//     if (confirmed) {
//       try {
//         const token = localStorage.getItem("token");
//         await axios.delete(`http://localhost:8000/api/owners/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setOwners(owners.filter((owner) => owner._id !== userId));
//       } catch (err) {
//         alert("Error deleting owner");
//       }
//     } else {
//       console.log("Deletion canceled");
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewOwner({
//       ...newOwner,
//       [name]: value,
//     });
//   };

//   const handleAddOwner = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(
//         "http://localhost:8000/api/owners",
//         newOwner,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setSuccessMsg(response.data.msg);
//       setNewOwner({ FirstName: "", LastName: "", email: "", password: "" });
//       setErrorMsg("");
//       setOwners([...owners, response.data.owner]);
//       setModalOpen(false); // Close modal after adding owner
//     } catch (err) {
//       setErrorMsg(err.response ? err.response.data.msg : "Error adding owner");
//       setSuccessMsg("");
//     }
//   };

//   const openModal = () => {
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//   };

//   if (loading) return <div className="p-6 text-center text-gray-600">Loading...</div>;
//   if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

//   return (
//     <div className="p-6 bg-white min-h-screen text-gray-900">
//       <h1 className="text-2xl font-semibold text-teal-400 mb-6">Manage Owners</h1>

//       {/* Add New Owner Button */}
//       <button
//         onClick={openModal}
//         className="mb-6 px-4 py-2 bg-teal-400 text-white rounded-md hover:bg-teal-500"
//       >
//         Add Owner
//       </button>

//       {/* Modal */}
//       {modalOpen && (
//         <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded-md shadow-md w-1/3">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Owner</h2>
//             {successMsg && <div className="text-green-600">{successMsg}</div>}
//             {errorMsg && <div className="text-red-600">{errorMsg}</div>}
//             <form onSubmit={handleAddOwner}>
//               <div className="mb-4">
//                 <label className="block text-gray-700" htmlFor="FirstName">First Name</label>
//                 <input
//                   type="text"
//                   id="FirstName"
//                   name="FirstName"
//                   value={newOwner.FirstName}
//                   onChange={handleInputChange}
//                   className="mt-2 p-2 w-full border border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700" htmlFor="LastName">Last Name</label>
//                 <input
//                   type="text"
//                   id="LastName"
//                   name="LastName"
//                   value={newOwner.LastName}
//                   onChange={handleInputChange}
//                   className="mt-2 p-2 w-full border border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700" htmlFor="email">Email</label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={newOwner.email}
//                   onChange={handleInputChange}
//                   className="mt-2 p-2 w-full border border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700" htmlFor="password">Password</label>
//                 <input
//                   type="password"
//                   id="password"
//                   name="password"
//                   value={newOwner.password}
//                   onChange={handleInputChange}
//                   className="mt-2 p-2 w-full border border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="mr-4 px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
//                 >
//                   Close
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-teal-400 text-white rounded-md hover:bg-teal-500"
//                 >
//                   Add Owner
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Owners List */}
//       <div className="bg-white rounded-lg overflow-hidden border border-gray-300">
//         <table className="min-w-full table-auto">
//           <thead>
//             <tr className="bg-gray-200 border-b border-gray-300">
//               <th className="px-4 py-3 text-left text-gray-800 font-semibold">First Name</th>
//               <th className="px-4 py-3 text-left text-gray-800 font-semibold">Last Name</th>
//               <th className="px-4 py-3 text-left text-gray-800 font-semibold">Email</th>
//               <th className="px-4 py-3 text-left text-gray-800 font-semibold">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {owners.map((owner) => (
//               <tr key={owner._id} className="border-b border-gray-300 hover:bg-gray-100 transition-colors duration-150">
//                 <td className="px-4 py-3 text-gray-900">{owner.FirstName}</td>
//                 <td className="px-4 py-3 text-gray-900">{owner.LastName}</td>
//                 <td className="px-4 py-3 text-gray-900">{owner.email}</td>
//                 <td className="px-4 py-3">
//                   <button
//                     onClick={() => handleDelete(owner._id)}
//                     className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ManageOwner;
