import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ isLoggedIn }) => {
  const location = useLocation();
  const storedUser = JSON.parse(localStorage.getItem("user")); // <-- Fetch from localStorage
  const isProfilePage = location.pathname === "/profile";
  const isAccount = location.pathname === "/account";
  const isTransactions = location.pathname === "/transactions";
  const isLoan = location.pathname === "/loan";
  const isAdminDashboard = location.pathname === "/adminDashboard";
  const isAdminUsers = location.pathname === "/adminUsers";
  const isAdminTransactions = location.pathname === "/adminTransactions";
  const isAdminSettings = location.pathname === "/adminSettings";


  const isDashboardPage = location.pathname.startsWith('/dashboard') && isLoggedIn;
  if (isProfilePage) return null;
  if (isAccount) return null;
  if (isTransactions) return null;
  if (isLoan) return null;
  if (isAdminDashboard) return null;
  if (isAdminUsers) return null;
  if (isAdminTransactions) return null;
  if (isAdminSettings) return null;




  return (
    <nav className="flex justify-between items-center p-4 bg-[#fbe8dc] ">
      <div className="flex items-center gap-2">
        <img src={require('../assets/bank.png')} alt="logo" className="h-6" />
        <span className="text-black font-bold">
              Bank<span className="text-red-600">ly</span>
            </span>      </div>
      

      <div className="flex items-center gap-6 font-medium text-red-600">
        {isDashboardPage ? (
          <span>{storedUser?.name}</span>  
        ) : (
          <>
            <Link to="/">About</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/adminLogin">Admin</Link>
            <Link to="/login">
              <button className="border border-red-600 px-4 py-1 rounded hover:bg-red-600 hover:text-white">
                Login
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
