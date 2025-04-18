import React from 'react'
import OwnerSidebar from '../components/OwnerSidebar'
import OwnerDashboard from '../components/OwnerDashboard'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import OwnerFutsal from './OwnerFutsal';
import AllBooking from './AllBooking';
import ArenaReview from './ArenaReview';
import PaymentArena from './PaymentArena';
import OwnerProfile from './OwnerProfile';


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
                    <Route path="/reviews" element={< ArenaReview/>} />
                    <Route path="/payments" element={< PaymentArena/>} />
                    <Route path="/profile" element={< OwnerProfile/>} />

                </Routes>
            </div>
        </div>
  )
}

export default OwnerHome