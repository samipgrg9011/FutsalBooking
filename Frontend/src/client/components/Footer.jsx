import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-8 mt-12">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Grid layout with adjusted spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          
          {/* Logo & About Section */}
          <div className="min-w-[200px]">
            <h3 className="text-xl font-semibold">FutsalHub</h3>
            <p className="text-sm mt-2 opacity-80 leading-relaxed">
              Experience premium futsal facilities and book your court with ease.
            </p>
          </div>

          {/* Quick Links (Shifted More Right) */}
          <div className="min-w-[200px] ml-24 lg:ml-40 xl:ml-56">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:underline">Our Courts</a></li>
              <li><a href="#" className="hover:underline">Book a Court</a></li>
              <li><a href="#" className="hover:underline">Membership</a></li>
              <li><a href="#" className="hover:underline">Tournaments</a></li>
            </ul>
          </div>

          {/* Contact Us (Shifted More Right) */}
          <div className="min-w-[200px] ml-24 lg:ml-40 xl:ml-56">
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <p className="text-sm opacity-80 flex items-center">
                <FiMapPin className="mr-2" /> 123 Futsal Street, Sportsville
              </p>
              <p className="text-sm opacity-80 flex items-center">
                <FiPhone className="mr-2" /> (123) 456-7890
              </p>
              <p className="text-sm opacity-80 flex items-center">
                <FiMail className="mr-2" /> info@profutsal.com
              </p>
            </div>
          </div>

          {/* Follow Us (Shifted More Right) */}
          <div className="min-w-[200px] ml-24 lg:ml-40 xl:ml-56">
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-300 text-xl"><FaFacebook /></a>
              <a href="#" className="hover:text-gray-300 text-xl"><FaTwitter /></a>
              <a href="#" className="hover:text-gray-300 text-xl"><FaInstagram /></a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm opacity-80">
          © 2025 Pro Futsal. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
