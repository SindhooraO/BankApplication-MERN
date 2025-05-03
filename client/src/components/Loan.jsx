import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaHome,
  FaWallet,
  FaExchangeAlt,
  FaMoneyBillWave,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import defaultProfile from "../assets/prof.jpg";
import bankLogo from "../assets/bank.png";

// Sidebar Link Component
const SidebarLink = ({ icon, label, path, activePath }) => {
  const isActive = activePath === path;
  return (
    <Link
      to={path}
      className={`flex items-center gap-3 px-2 py-2 rounded-md ${
        isActive
          ? "bg-red-200 text-red-800 font-semibold"
          : "text-gray-800 hover:text-red-600"
      } transition-all`}
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
  const [creditRating, setCreditRating] = useState("Average");
  const [showModal, setShowModal] = useState(false);
  const [loanStatus, setLoanStatus] = useState(null); // Initially null
  const location = useLocation();

  useEffect(() => {
    fetchProfile();
    fetchCreditRating();
    fetchTransactions();
    fetchLoanStatus();

  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        "http://localhost:5000/api/auth/user/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserName(data.name);
      setPreviewImage(
        data.image ? `http://localhost:5000/${data.image}` : defaultProfile
      );
    } catch (error) {
      console.error("Profile load error:", error);
    }
  };

  const fetchCreditRating = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        "http://localhost:5000/api/loan/recommendation",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCreditRating(data.creditRating || "Average");
    } catch (error) {
      console.error("Credit rating fetch error:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        "http://localhost:5000/api/account/transactions",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTransactions(data);
      generateLoanRecommendation(data);
    } catch (error) {
      console.error("Transaction fetch error:", error);
    }
  };
  const fetchLoanStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/loan/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoanStatus(data.status); // Set the status from backend
    } catch (err) {
      console.error("Error fetching loan status:", err);
    }
  };
  

  const getCreditMultiplier = (rating) => {
    switch (rating) {
      case "Excellent":
        return 2;
      case "Good":
        return 1;
      case "Average":
        return 0;
      case "Poor":
        return -1;
      default:
        return 0;
    }
  };

  const generateLoanRecommendation = (transactions) => {
    if (!transactions || transactions.length === 0) {
      setLoanRecommendation(null);
      return;
    }

    const sortedTx = [...transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const monthlyMap = {};
    let totalDeposits = 0;
    let totalWithdrawals = 0;
    let balance = 0;

    sortedTx.forEach((tx) => {
      const amount = tx.amount;
      const date = new Date(tx.date);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!monthlyMap[key]) monthlyMap[key] = { deposits: 0, withdrawals: 0 };

      if (amount > 0) {
        monthlyMap[key].deposits += amount;
        totalDeposits += amount;
      } else {
        monthlyMap[key].withdrawals += Math.abs(amount);
        totalWithdrawals += Math.abs(amount);
      }

      balance += amount;
    });

    const months = Object.keys(monthlyMap).length;
    const avgMonthlyDeposit = totalDeposits / months;
    const avgMonthlyWithdrawal = totalWithdrawals / months;
    const riskScore = avgMonthlyWithdrawal / (avgMonthlyDeposit || 1);

    let baseMultiplier = 2;
    let loanType = "Cautioned Loan";

    if (riskScore < 0.4) {
      baseMultiplier = 6;
      loanType = "Premium Loan";
    } else if (riskScore < 0.7) {
      baseMultiplier = 4;
      loanType = "Standard Loan";
    }

    const creditMultiplier = getCreditMultiplier(creditRating);
    const finalMultiplier = Math.max(0, baseMultiplier + creditMultiplier);
    const recommendedAmount = avgMonthlyDeposit * finalMultiplier;

    setLoanRecommendation({
      amount: recommendedAmount,
      type: loanType,
      risk: riskScore.toFixed(2),
      avgMonthlyDeposit: avgMonthlyDeposit.toFixed(2),
      creditRating,
    });
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  const handleSubmitLoan = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/loan/apply",
        {
          loanType: loanRecommendation.type,
          amount: loanRecommendation.amount,
          riskScore: loanRecommendation.risk,
          status: "Applied",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Loan application submitted successfully!");
      setLoanStatus("Applied"); // Change loan status after successful submission
      setShowModal(false); // Close the modal
    } catch (err) {
      console.error("Loan submission error:", err);
      alert("Failed to submit loan application.");
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
            <SidebarLink icon={<FaHome />} label="Dashboard" path="/dashboard" activePath={location.pathname} />
            <SidebarLink icon={<FaWallet />} label="Account" path="/account" activePath={location.pathname} />
            <SidebarLink icon={<FaExchangeAlt />} label="Transactions" path="/transactions" activePath={location.pathname} />
            <SidebarLink icon={<FaMoneyBillWave />} label="Loan" path="/loan" activePath={location.pathname} />
            <SidebarLink icon={<FaUser />} label="Profile" path="/profile" activePath={location.pathname} />
          </nav>
        </div>
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

        {/* Loan Recommendation */}
        <main className="flex-1 p-8 bg-[#fbe8dc]">
          <h2 className="text-3xl font-bold mb-6">Loan Recommendations</h2>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-red-600">Your Personalized Loan Offer</h3>
            {loanRecommendation ? (
              <div className="mt-4">
                <p className="text-2xl font-bold">
                  ₹{" "}
                  {parseFloat(loanRecommendation.amount).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-lg font-medium mt-1">{loanRecommendation.type}</p>
                <p className="mt-4 text-gray-700">
                  Based on your financial behavior and credit rating, you're eligible for a{" "}
                  <strong>{loanRecommendation.type}</strong> of up to ₹{" "}
                  {parseFloat(loanRecommendation.amount).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}.
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Avg Monthly Deposit: ₹ {loanRecommendation.avgMonthlyDeposit} <br />
                  Risk Score: {loanRecommendation.risk}
                </p>
                <button 
                  onClick={() => setShowModal(true)}
                  disabled={["Approved"].includes(loanStatus)}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full mt-4"
                >
                  Apply Now
                </button >

                {loanStatus && (
  <div className="mt-6">
    <p className={`text-xl font-semibold flex items-center gap-2 ${
      loanStatus === "Approved"
        ? "text-green-600"
        : loanStatus === "Rejected"
        ? "text-red-600"
        : "text-yellow-600"
    }`}>
      {loanStatus === "Approved" && "✅"}
      {loanStatus === "Rejected" && "❌"}
      {loanStatus === "Applied" && "⏳"}
      Loan Application Status:{" "}
      <span className="ml-2 font-bold capitalize">{loanStatus}</span>
    </p>
  </div>
)}

              </div>
            ) : (
              <p className="text-gray-400">
                Analyzing your transaction and credit history... Please wait.
              </p>
            )}
          </div>
        </main>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-red-600 mb-4">Loan Application</h3>
            <p className="mb-2">Name: {userName}</p>
            <p className="mb-2">Loan Type: {loanRecommendation.type}</p>
            <p className="mb-2">Recommended Amount: ₹ {parseFloat(loanRecommendation.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
            <p className="mb-4">Risk Score: {loanRecommendation.risk}</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitLoan}
                className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-md"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loan;
