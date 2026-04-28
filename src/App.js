import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/user/UserDashboard';
import BrowseWorkshops from './pages/user/BrowseWorkshops';
import WorkshopDetail from './pages/user/WorkshopDetail';
import MyAppointments from './pages/user/MyAppointments';
import MechanicDashboard from './pages/mechanic/MechanicDashboard';
import ManageWorkshop from './pages/mechanic/ManageWorkshop';
import ManageAppointments from './pages/mechanic/ManageAppointments';

function AppRoutes() {
  const { currentUser } = useApp();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        {/* USER ROUTES */}
        <Route path="/inicio" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
        <Route path="/talleres" element={<ProtectedRoute role="user"><BrowseWorkshops /></ProtectedRoute>} />
        <Route path="/talleres/:id" element={<ProtectedRoute role="user"><WorkshopDetail /></ProtectedRoute>} />
        <Route path="/mis-citas" element={<ProtectedRoute role="user"><MyAppointments /></ProtectedRoute>} />

        {/* MECHANIC ROUTES */}
        <Route path="/panel" element={<ProtectedRoute role="mechanic"><MechanicDashboard /></ProtectedRoute>} />
        <Route path="/panel/taller" element={<ProtectedRoute role="mechanic"><ManageWorkshop /></ProtectedRoute>} />
        <Route path="/panel/citas" element={<ProtectedRoute role="mechanic"><ManageAppointments /></ProtectedRoute>} />

        {/* REDIRECT AFTER LOGIN */}
        <Route path="*" element={
          currentUser
            ? <Navigate to={currentUser.role === 'mechanic' ? '/panel' : '/inicio'} replace />
            : <Navigate to="/" replace />
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
