import React from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { Route, Routes } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';
import AdminFutsal from './AdminFutsal';
// import ManageOwner from './ManageOwner';
import ManageFutsal from './ManageFutsal';
import LoggedUsers from './LoggedUser';
import AllBooking from '../../owner/pages/AllBooking';


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
                    <Route path="/product" element={<AdminFutsal />} />
                    {/* <Route path="/owners" element={<ManageOwner />} /> */}
                    <Route path="/arenas" element={<ManageFutsal />} />
                    <Route path="/users" element={<LoggedUsers />} />
                    <Route path="/bookings" element={<AllBooking />} />


                </Routes>
            </div>
        </div>
  )
}

export default AdminHome