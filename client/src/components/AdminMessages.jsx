import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaHome,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaUsers,
  FaEnvelope
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState("Admin");
  const [previewImage, setPreviewImage] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/contact/messages", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      window.location.href = "/adminLogin";
    }
  };

  return (
    <div className="admin-messages flex">
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
            <SidebarLink icon={<FaEnvelope />} label="Messages" path="/adminMessages" activePath={location.pathname} />
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

        {/* Messages Table */}
        <main className="flex-1 p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact Form Submissions</h2>
          <div className="overflow-x-auto bg-white shadow-xl rounded-xl border border-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gradient-to-r from-red-100 to-red-200 text-red-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Phone</th>
                  <th className="px-6 py-4 font-semibold">Message</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <tr
                      key={msg._id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-red-50 transition`}
                    >
                      <td className="px-6 py-3">{msg.name}</td>
                      <td className="px-6 py-3">{msg.phone}</td>
                      <td className="px-6 py-3">{msg.message}</td>
                      <td className="px-6 py-3">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No messages found.
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

export default AdminMessages;
