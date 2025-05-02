import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaUser,
  FaSignOutAlt,
  FaWallet,
  FaEye,
  FaEyeSlash,
  FaCog,
  FaUsers,
  FaUserPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaClock
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const [showBalance, setShowBalance] = useState(false);
  const [userName, setUserName] = useState("Admin");
  const [previewImage, setPreviewImage] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    approvedLoans: 0,
    rejectedLoans: 0,
    pendingLoans: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/admin/dashboard-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    const fetchRecentUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/admin/recent-users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentUsers(response.data);
      } catch (error) {
        console.error("Error fetching recent users:", error);
      }
    };

    fetchDashboardStats();
    fetchRecentUsers();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      window.location.href = "/adminLogin";
    }
  };

  return (
    <div className="flex min-h-screen text-gray-800 font-sans">
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
      <div className="flex-1 flex flex-col bg-gradient-to-br from-[#fbe8dc] to-[#f8d6c8]">
        {/* Topbar */}
        <div className="flex justify-end items-center p-4">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-red-600 text-md">{userName}</span>
            <img
              src={previewImage || require("../assets/prof.jpg")}
              alt="Admin"
              className="w-9 h-9 rounded-full object-cover"
            />
          </div>
        </div>

        {/* Dashboard */}
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome Back, {userName}</h1>

          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <StatBox icon={<FaUserPlus />} label="Total Users" value={dashboardStats.totalUsers} color="bg-blue-100 text-blue-800" />
            <StatBox icon={<FaCheckCircle />} label="Approved Loans" value={dashboardStats.approvedLoans} color="bg-green-100 text-green-800" />
            <StatBox icon={<FaTimesCircle />} label="Rejected Loans" value={dashboardStats.rejectedLoans} color="bg-red-100 text-red-800" />
            <StatBox icon={<FaClock />} label="Pending Loans" value={dashboardStats.pendingLoans} color="bg-yellow-100 text-yellow-800" />
          </section>

          {/* Recent Users */}
          <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Phone</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.length > 0 ? (
                    recentUsers.map((user, index) => (
                      <tr
                        key={index}
                        className="border-t hover:bg-gray-50 transition-all"
                      >
                        <td className="px-4 py-2">{user.name}</td>
                        <td className="px-4 py-2">{user.phone}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.profileCompleted
                                ? "bg-green-200 text-green-700"
                                : "bg-red-200 text-red-700"
                            }`}
                          >
                            {user.profileCompleted ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-gray-500">
                        No recent users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
      className={`flex items-center gap-3 px-2 py-2 rounded-md ${
        isActive ? "bg-red-200 text-red-800 font-semibold" : "text-gray-800 hover:text-red-600"
      } transition-all`}
    >
      {icon} {label}
    </Link>
  );
};

// Stat Card Component
const StatBox = ({ icon, label, value, color }) => (
  <div className={`rounded-xl shadow-md p-5 text-center border hover:shadow-lg transition-all ${color}`}>
    <div className="text-2xl mb-2">{icon}</div>
    <p className="text-sm font-semibold">{label}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

export default AdminDashboard;
