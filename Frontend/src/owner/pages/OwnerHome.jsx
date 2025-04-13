import React from 'react'
import OwnerSidebar from '../components/OwnerSidebar'
import OwnerDashboard from '../components/OwnerDashboard'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import OwnerFutsal from './OwnerFutsal';
import AllBooking from './AllBooking';


const OwnerHome = () => {
  return (
    <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800">
                <OwnerSidebar />
            </div>

            <div className="flex-1">
                <Routes>
                    <Route path="/" element={<OwnerDashboard />} />
                    <Route path="/futsal" element={< OwnerFutsal/>} />
                    <Route path="/bookings" element={< AllBooking/>} />


                </Routes>
            </div>
        </div>
  )
}

export default OwnerHome