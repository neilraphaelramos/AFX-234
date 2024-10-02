import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUpForm from './components/pages/signup'
import SignInForm from './components/pages/signin';
import UserDashboard from './components/pages/dashboard';
import MainHome from './components/pages/home';
import AdminDashboard from './components/pages/dashboardadmin';

function App() {

  return (
    <>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<MainHome />} />
            <Route path="/signin" element={<SignInForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
