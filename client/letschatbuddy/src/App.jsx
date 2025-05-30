import './App.css'
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Authentication/Login';
import SignUp from './pages/Authentication/SignUp';
import LandingPage from './pages/Home/LandingPage';
import Dashboard from './pages/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';


function App() {

  return (
    <Routes>
      
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/app/*" element={<Dashboard />} />
      </Route>

    </Routes>
  )
}

export default App;
