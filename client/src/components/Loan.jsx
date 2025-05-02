import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHome, FaWallet, FaExchangeAlt, FaMoneyBillWave, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import defaultProfile from "../assets/prof.jpg";
import bankLogo from "../assets/bank.png";

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
const Loan = () => {
  const [transactions, setTransactions] = useState([]);
  const [userName, setUserName] = useState("");
  const [previewImage, setPreviewImage] = useState(defaultProfile);
  const [loanRecommendation, setLoanRecommendation] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchTransactions();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/auth/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserName(data.name);
      setPreviewImage(data.image ? `http://localhost:5000/${data.image}` : defaultProfile);
    } catch (error) {
      console.error("Profile load error:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/account/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(data);
      generateLoanRecommendation(data);
    } catch (error) {
      console.error("Transaction fetch error:", error);
    }
  };

  const generateLoanRecommendation = (transactions) => {
    const totalDeposits = transactions
      .filter(tx => tx.amount > 0)
      .reduce((acc, tx) => acc + tx.amount, 0);

    const totalWithdrawals = transactions
      .filter(tx => tx.amount < 0)
      .reduce((acc, tx) => acc + tx.amount, 0);

    const recentDeposits = transactions.filter(tx => tx.amount > 0).length;
    const recentWithdrawals = transactions.filter(tx => tx.amount < 0).length;

    // Example recommendation logic (simplified):
    let loanAmount = 0;
    if (recentDeposits > 5) {
      loanAmount = totalDeposits * 0.5; // Loan amount based on deposits
    } else if (recentWithdrawals > 5) {
      loanAmount = Math.abs(totalWithdrawals) * 0.3; // Loan amount based on withdrawals
    } else {
      loanAmount = totalDeposits * 0.2; // Default loan recommendation
    }

    setLoanRecommendation({
      amount: loanAmount,
      type: loanAmount > 50000 ? "Premium Loan" : "Standard Loan",
    });
  };
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
               <img src={bankLogo} alt="Bankly Logo" className="h-6" />
               <span className="text-black font-bold">
                 Bank<span className="text-red-600">ly</span>
               </span>
             </div>
   
             <nav className="space-y-6 text-sm font-medium">
               <SidebarLink icon={<FaHome />} label="Dashboard" path="/dashboard"activePath={location.pathname} />
                          <SidebarLink icon={<FaWallet />} label="Account" path="/account" activePath={location.pathname}/>
                          <SidebarLink icon={<FaExchangeAlt />} label="Transactions" path="/transactions"activePath={location.pathname} />
                          <SidebarLink icon={<FaMoneyBillWave />} label="Loan" path="/loan"activePath={location.pathname} />
                          <SidebarLink icon={<FaUser />} label="Profile" path="/profile"activePath={location.pathname} />
             </nav>
           </div>
   
           {/* Logout */}
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
            <img
              src={previewImage}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover cursor-pointer hover:opacity-80 transition"
            />
          </div>
        </div>

        {/* Loan Recommendation Content */}
        <main className="flex-1 p-8 bg-[#fbe8dc]">
          <h2 className="text-3xl font-bold mb-6">Loan Recommendations</h2>

          {/* Loan Recommendation Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-red-600">Recommended Loan</h3>
            {loanRecommendation ? (
              <div className="mt-4">
                <p className="text-2xl font-bold">₹ {loanRecommendation.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                <p className="text-lg font-medium mt-2">{loanRecommendation.type}</p>
                <p className="mt-4 text-gray-700">
                  Based on your recent transactions, we suggest a loan of ₹ {loanRecommendation.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}.
                  <br />
                  You can proceed with the loan application by clicking below.
                </p>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full mt-4"
                >
                  Apply Now
                </button>
              </div>
            ) : (
              <p className="text-gray-400">We are analyzing your transaction history to provide a loan recommendation.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Loan;
