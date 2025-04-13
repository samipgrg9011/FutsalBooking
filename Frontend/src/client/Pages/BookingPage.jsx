// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import BookingForm from '../components/BookingForm';
// import AvailableSlots from '../components/AvailableSlots';

// const BookingPage = () => {
//     const { futsalId } = useParams(); // Get the futsalId from the URL
//     const [date, setDate] = useState('');
//     const [futsal, setFutsal] = useState(null);
//     const navigate = useNavigate();

//     // Fetch futsal details
//     useEffect(() => {
//         const fetchFutsal = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:8000/api/futsal/${futsalId}`);
//                 setFutsal(response.data.futsal);
//             } catch (error) {
//                 console.error('Error fetching futsal details:', error);
//             }
//         };

//         fetchFutsal();
//     }, [futsalId]);

//     if (!futsal) {
//         return <p>Loading...</p>;
//     }

//     return (
//         <div className="container mx-auto p-4">
//             <button
//                 onClick={() => navigate('/')}
//                 className="mb-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
//             >
//                 Back to Home
//             </button>
//             <h1 className="text-2xl font-bold mb-4">Book {futsal.name}</h1>
//             <BookingForm futsalArena={futsalId} />
//             <div className="mt-8">
//                 <label className="block">Select Date to View Available Slots</label>
//                 <input
//                     type="date"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                     className="w-full p-2 border rounded"
//                 />
//                 {date && <AvailableSlots futsalArena={futsalId} date={date} />}
//             </div>
//         </div>
//     );
// };

// export default BookingPage;