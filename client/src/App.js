import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import ProfileSetup from "./components/ProfileSetup";
import Dashboard from "./components/Dashboard";
import Contact from "./components/Contact";
import Profile from "./components/Profile";
import Account from "./components/Account";
import Transactions from "./components/Transactions";
import Loan from "./components/Loan";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AdminUsers from "./components/AdminUsers";
import AdminTransactions from "./components/AdminTransactions";
import AdminSettings from "./components/AdminSettings";
// import AdminReports from "./components/AdminReports";



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  return (
    <Router>
      {/* Conditionally render Navbar */}
      <NavbarVisibilityWrapper isLoggedIn={isLoggedIn} user={user} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/setup-profile" element={<ProfileSetup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/account" element={<Account />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/loan" element={<Loan />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/adminUsers" element={<AdminUsers />} />
        <Route path="/adminTransactions" element={<AdminTransactions />} />
        {/* <Route path="/adminReports" element={<AdminReports />} /> */}
        <Route path="/adminSettings" element={<AdminSettings />} />


      </Routes>
    </Router>
  );
}

const NavbarVisibilityWrapper = ({ isLoggedIn, user }) => {
  const location = useLocation();

  // Only render Navbar if we're not on the Dashboard page
  if (location.pathname === "/dashboard") {
    return null; // Don't render Navbar on Dashboard page
  }

  return <Navbar isLoggedIn={isLoggedIn} user={user} />;
};

export default App;
