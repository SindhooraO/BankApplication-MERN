import React, { useState, useEffect } from "react";
import { FaHome, FaMoneyBillWave, FaExchangeAlt, FaUser, FaSignOutAlt, FaWallet, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [showBalance, setShowBalance] = useState(false);
  const [linkedAccountNo, setLinkedAccountNo] = useState("");
  const [userName, setUserName] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [loanCount, setLoanCount] = useState(0);

  const [accountDetails, setAccountDetails] = useState({
    balance: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
  });
  useEffect(() => {
    const fetchLoanCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/loan/user/count", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setLoanCount(response.data.count);
      } catch (error) {
        console.error("Error fetching loan count:", error);
      }
    };
  
    fetchLoanCount();
  }, []);
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/auth/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        console.log("PROFILE RESPONSE:", response.data);

        setLinkedAccountNo(response.data.linkedAccountNo);
        setUserName(response.data.name);

        // Add preview image like in Profile page
        setPreviewImage(response.data.image ? `http://localhost:5000/${response.data.image}` : require('../assets/prof.jpg'));
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // Fetch account details
  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/account/account-details", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setAccountDetails(response.data);
      } catch (error) {
        console.error("Error fetching account details:", error);
      }
    };

    fetchAccountDetails();
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  return (
    <div className="flex min-h-screen text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-[#fbe8dc] border-r-4 border-red-700 p-6 flex flex-col justify-between shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <img src={require('../assets/bank.png')} alt="logo" className="h-6" />
            <span className="text-black font-bold">
              Bank<span className="text-red-600">ly</span>
            </span>
          </div>

          <nav className="space-y-5 text-sm font-medium">
          <SidebarLink icon={<FaHome />} label="Dashboard" path="/dashboard"activePath={location.pathname} />
            <SidebarLink icon={<FaWallet />} label="Account" path="/account" activePath={location.pathname}/>
            <SidebarLink icon={<FaExchangeAlt />} label="Transactions" path="/transactions"activePath={location.pathname} />
            <SidebarLink icon={<FaMoneyBillWave />} label="Loan" path="/loan"activePath={location.pathname} />
            <SidebarLink icon={<FaUser />} label="Profile" path="/profile"activePath={location.pathname} />
          </nav>
        </div>

        {/* Logout Button */}
        <div className="mt-6 border-t pt-4">
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-red-600 flex items-center gap-1 hover:text-red-700 transition-all"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="flex justify-end items-center p-4 bg-[#fbe8dc] shadow-md">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-red-600">{userName || "User"}</span>
            <Link to="/profile">
              <img
                src={previewImage || require('../assets/prof.jpg')} // Dynamic image
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover cursor-pointer hover:opacity-80 transition"
              />
            </Link>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-8 bg-[#fbe8dc]">
          <h1 className="text-3xl font-bold text-gray-700 mb-2">Dashboard</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            Welcome, {userName || "User"}!
          </h2>

          <section className="grid gap-8">
            {/* Balance Box */}
            <div className="bg-white shadow-xl rounded-2xl p-6 flex justify-between items-center border border-red-300 hover:shadow-2xl transition-all h-40">
              <div>
                <p className="font-semibold text-gray-800">Savings</p>
                <p className="text-sm font-semibold text-gray-500">
                  Account No: {linkedAccountNo || "Loading..."}
                </p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? (
                  <>
                    <FaEyeSlash className="text-gray-600" />
                    <span className="text-xl font-semibold">₹ {accountDetails.balance}</span>
                  </>
                ) : (
                  <>
                    <FaEye className="text-gray-600" />
                    <span className="text-xl font-semibold">****</span>
                  </>
                )}
              </div>
            </div>

            {/* Stat Boxes */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <StatBox label="Total Deposits" value={`₹ ${accountDetails.totalDeposits}`} />
              <StatBox label="Total Withdrawals" value={`₹ ${accountDetails.totalWithdrawals}`} />
              {/* <StatBox label="Total Transactions" value="₹ 0.0" /> You can add logic to fetch total transactions */}
              <StatBox label="Loans Applied" value={loanCount} />
              </div>
          </section>
        </main>
      </div>
    </div>
  );
};

// Sidebar Link Component
const SidebarLink = ({ icon, label, path, activePath }) => {
  const isActive = activePath === path;
  return (
    <Link
      to={path}
      className={`flex items-center gap-3 px-2 py-2 rounded-md ${isActive ? "bg-red-200 text-red-800 font-semibold" : "text-gray-800 hover:text-red-600"} transition-all`}
    >
      {icon} {label}
    </Link>
  );
};

const StatBox = ({ label, value }) => (
  <div className="bg-white rounded-2xl shadow-xl p-6 text-center border border-rose-200 hover:shadow-2xl transition-all">
    <p className="text-sm font-semibold text-gray-800">{label}</p>
    <p className="text-xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
);

export default Dashboard;
