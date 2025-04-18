
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { setUser } from './features/user/userSlice';

import Header from './client/components/Header';
import Home from './client/Pages/Home';
import Mybooking from './client/Pages/Mybooking';
import BecomeOwner from './client/Pages/BecomeOwner';
import About from './client/Pages/About';
import SignIn from './client/components/SignIn';
import AdminHome from './admin/pages/AdminHome';
import OwnerHome from './owner/pages/OwnerHome';
import FutsalDetail from './client/Pages/FutsalDetail';
import BookArena from './client/Pages/BookArena';
import FindFutsalCourts from './client/Pages/FindFutsalCourts';
import PaymentSuccess from './client/Pages/PaymentSuccess';
import UserProfile from './client/Pages/UserProfile';


const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = jwtDecode(token);
        dispatch(setUser(userData));
        

        // Redirect based on role when user refreshes the page
        if (userData.role === 'admin') {
          navigate('/admin');
        } else if (userData.role === 'owner') {
          navigate('/owner');
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token"); // Remove invalid token
        
      }
    }
  }, [dispatch]);

  return (
    <>
      {user?.role === 'admin' ? (
        <Routes>
          <Route path="/admin/*" element={<AdminHome />} />
          <Route path="*" element={<Navigate to="/admin" />} />
          
        </Routes>
      ) : user?.role === 'owner' ? (
        <Routes>
          <Route path="/owner/*" element={<OwnerHome />} />
          <Route path="*" element={<Navigate to="/owner" />} />
        </Routes>
      ) : (
        <>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/findfutsalcourts" element={<FindFutsalCourts />} />
            <Route path="/booking/success/" element={<PaymentSuccess/>} />
            <Route path="/UserProfile" element={<UserProfile/>} />
            <Route path="/mybooking" element={<Mybooking />} />
            <Route path="/becomeowner" element={<BecomeOwner />} />
            <Route path="/about" element={<About />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/futsal/:id" element={<FutsalDetail />} />
            <Route path="/book/:id" element={<BookArena />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      )}
    </>
  );
};

export default App;
