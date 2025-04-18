import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-white py-10">
      <div className="container mx-auto max-w-screen-xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="font-bold text-2xl text-emerald-500">FutsalHub</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your one-stop platform to find and book futsal courts near you. Join
              our community and enjoy seamless booking experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg text-emerald-500 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link
                  to="/findfutsalcourts"
                  className="hover:text-emerald-400 transition-colors duration-200"
                >
                  Find Courts
                </Link>
              </li>
              <li>
                <Link
                  to="/mybooking"
                  className="hover:text-emerald-400 transition-colors duration-200"
                >
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-emerald-400 transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/becomeowner"
                  className="hover:text-emerald-400 transition-colors duration-200"
                >
                  Become an Owner
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg text-emerald-500 mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-emerald-500" />
                <span>Patandurbatr square, Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="text-emerald-500" />
                <span>+977 123-456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-emerald-500" />
                <a
                  href="mailto:support@futsalhub.com"
                  className="hover:text-emerald-400 transition-colors duration-200"
                >
                  support@futsalhub.com
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="font-semibold text-lg text-emerald-500 mb-4">
              Follow Us
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Connect with us on social media for updates and community events.
            </p>
            <div className="flex gap-4">
              <a
                className="text-emerald-500 hover:text-emerald-400 transition-colors duration-200"
              >
                <FaFacebook className="text-2xl" />
              </a>
              <a
                className="text-emerald-500 hover:text-emerald-400 transition-colors duration-200"
              >
                <FaTwitter className="text-2xl" />
              </a>
              <a
                className="text-emerald-500 hover:text-emerald-400 transition-colors duration-200"
              >
                <FaInstagram className="text-2xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-600 flex flex-col md:flex-row justify-between items-center text-gray-300 text-sm">
          <p>
            © 2025 FutsalHub. All rights reserved.
          </p>
          <div className="flex gap-6 mt-2 md:mt-0">
            <Link
              to="/privacy"
              className="hover:text-emerald-400 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-emerald-400 transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;