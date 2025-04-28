import React from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { Route, Routes } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';
// import ManageOwner from './ManageOwner';
import ManageFutsal from './ManageFutsal';
import Reviews from './Reviews';
import Bookings from './Bookings';
import AllUsersForAdmin from './AllUser';
import AllPayment from './AllPayment';


const AdminHome = () => {
  return (
    <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800">
                <AdminSidebar />
            </div>

            <div className="flex-1">
                <Routes>
                    <Route path="/" element={<AdminDashboard/>} />
                    <Route path="/arenas" element={<ManageFutsal />} />
                    <Route path="/users" element={<AllUsersForAdmin/>} />
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/reviews" element={<Reviews />} />
                    <Route path="/payments" element={<AllPayment />} />
                </Routes>
            </div>
        </div>
  )
}

export default AdminHome