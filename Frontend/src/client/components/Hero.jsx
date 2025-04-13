// import React from "react";
// import myimage from "../../image/asthetoc.jpg";

// const Hero = ({ title = "Welcome to Pro Futsal", subtitle = "Experience premium futsal courts and world-class facilities." }) => {
//   return (
//     <div className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: `url(${myimage})` }}>
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black opacity-40"></div>

//       {/* Content */}
//       <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4 py-12">
//         <h2 className="text-5xl font-semibold leading-tight max-w-3xl mx-auto">
//           {title}
//         </h2>
//         <p className="mt-4 text-xl max-w-lg mx-auto opacity-80">
//           {subtitle}
//         </p>
//         <button
//           className="bg-blue-600 text-white px-8 py-4 mt-8 rounded-lg shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition duration-200"
//           aria-label="Book your futsal court"
//         >
//           Book Your Court Now
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Hero;
// components/Hero.jsx
// components/Hero.jsx
// components/Hero.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import myimage from "../../image/futsal-one.avif"; // Adjust the path based on your folder structure

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full h-[550px] bg-cover bg-center" // Full-screen height with image covering the section
      style={{ backgroundImage: `url(${myimage})` }}
    >


      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          Find and Book Futsal Courts Near You
        </h1>
        <p className="text-lg md:text-xl mb-6 text-white">
          Discover the best futsal courts and book your next game in seconds
        </p>
        <button
          className="bg-white text-green-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition"
          onClick={() => navigate("/findfutsalcourts")} // Route as specified
        >
          Find Courts
        </button>
      </div>
    </div>
  );
};

export default Hero;