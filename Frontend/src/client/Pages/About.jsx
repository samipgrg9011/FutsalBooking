import React from "react";
import { Link } from "react-router-dom";
import futsalimage from "../../image/futsalsignup.jpg"; 
import Footer from "../components/Footer"

const About = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-96 flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${futsalimage})`,
        }}
      >
        <div className="text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About Our Futsal Community
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Connecting players, teams, and venues to create unforgettable futsal
            experiences.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-green-600 mb-6">
              Our Mission
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              We are passionate about futsal and dedicated to building a platform
              that makes it easy for players to find courts, join teams, and
              participate in exciting events. Our goal is to grow the futsal
              community by fostering connection and competition.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-green-600 text-center mb-12">
            Why Join Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-green-600 mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Easy Booking
              </h3>
              <p className="text-gray-600">
                Reserve futsal courts with real-time availability and instant
                confirmation.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-green-600 mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v2h5m-2-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Community Connection
              </h3>
              <p className="text-gray-600">
                Find and join local teams or connect with players for pickup
                games.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-green-600 mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Trusted Platform
              </h3>
              <p className="text-gray-600">
                Partnered with top futsal venues for a seamless experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Kick Off?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join our futsal community today and start playing, connecting, and
            competing with players near you.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/signup"
              className="bg-white text-green-600 py-3 px-8 rounded-lg shadow-md text-base font-medium hover:bg-gray-100 transition"
            >
              Sign Up Now
            </Link>
           
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default About;