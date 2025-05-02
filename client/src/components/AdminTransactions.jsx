import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaUser,
  FaSignOutAlt,
  FaWallet,
  FaCog,
  FaUsers,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [userName, setUserName] = useState("Admin");
  const [previewImage, setPreviewImage] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/admin/transactions",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      window.location.href = "/adminLogin";
    }
  };

  return (
    <div className="flex min-h-screen text-gray-800 bg-[#fbe8dc]">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-[#fbe8dc] border-r-4 border-red-700 p-6 flex flex-col justify-between shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <img src={require("../assets/bank.png")} alt="logo" className="h-6" />
            <span className="text-black font-bold text-lg">
              Bank<span className="text-red-600">ly</span>
            </span>
          </div>

          <nav className="space-y-5 text-sm font-medium">
            <SidebarLink icon={<FaHome />} label="Dashboard" path="/adminDashboard" activePath={location.pathname} />
            <SidebarLink icon={<FaUsers />} label="Users" path="/adminUsers" activePath={location.pathname} />
            <SidebarLink icon={<FaExchangeAlt />} label="Transactions" path="/adminTransactions" activePath={location.pathname} />
            <SidebarLink icon={<FaMoneyBillWave />} label="Loan" path="/adminLoan" activePath={location.pathname} />
            <SidebarLink icon={<FaWallet />} label="Reports" path="/adminReports" activePath={location.pathname} />
            <SidebarLink icon={<FaCog />} label="Settings" path="/adminSettings" activePath={location.pathname} />
          </nav>
        </div>

        <div className="mt-6 border-t pt-4">
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-red-600 flex items-center gap-2 hover:text-red-700 transition-all"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="flex justify-end items-center p-4 ">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-red-600">{userName}</span>
            <img
              src={previewImage || require("../assets/prof.jpg")}
              alt="Admin"
              className="w-9 h-9 rounded-full object-cover hover:scale-105 transition-all duration-200"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <main className="flex-1 p-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">All Transactions</h2>

          <div className="overflow-x-auto bg-white shadow-xl rounded-xl border border-gray-200">
  <table className="min-w-full text-sm text-left">
    <thead className="bg-gradient-to-r from-red-100 to-red-200 text-red-700 sticky top-0 z-10">
      <tr>
        <th className="px-6 py-4 text-sm font-semibold">User</th>
        <th className="px-6 py-4 text-sm font-semibold">Type</th>
        <th className="px-6 py-4 text-sm font-semibold">Amount</th>
        <th className="px-6 py-4 text-sm font-semibold">Method</th>
        <th className="px-6 py-4 text-sm font-semibold">Account No</th>
        <th className="px-6 py-4 text-sm font-semibold">Date</th>
        <th className="px-6 py-4 text-sm font-semibold">Time</th>
      </tr>
    </thead>
    <tbody>
      {transactions.length > 0 ? (
        transactions.map((tx, index) => (
          <tr
            key={index}
            className={`transition-all duration-150 hover:bg-red-50 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            }`}
          >
            <td className="px-6 py-3">{tx.user ? `${tx.user.firstName} ${tx.user.lastName}` : "N/A"}</td>
            <td className="px-6 py-3 capitalize">{tx.type}</td>
            <td className="px-6 py-3 text-green-700 font-semibold">₹{tx.amount}</td>
            <td className="px-6 py-3">{tx.method}</td>
            <td className="px-6 py-3">{tx.user ? tx.user.linkedAccountNo : "N/A"}</td>
            <td className="px-6 py-3">{tx.date}</td>
            <td className="px-6 py-3">{tx.time}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="7" className="text-center py-6 text-gray-500">
            No transactions found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

        </main>
      </div>
    </div>
  );
};

const SidebarLink = ({ icon, label, path, activePath }) => {
  const isActive = activePath === path;
  return (
    <Link
      to={path}
      className={`flex items-center gap-3 px-2 py-2 rounded-md ${
        isActive ? "bg-red-200 text-red-800 font-semibold" : "text-gray-800 hover:text-red-600"
      } transition-all`}
    >
      {icon} {label}
    </Link>
  );
};

export default AdminTransactions;
