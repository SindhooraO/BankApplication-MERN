import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaHome,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaUser,
  FaSignOutAlt,
  FaWallet,
  FaCog,
  FaUsers,FaEnvelope
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const AdminSettings = () => {
    const [userName, setUserName] = useState("Admin");
    const [previewImage, setPreviewImage] = useState(null);
  
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });

  // Fetch admin details when the component mounts
  useEffect(() => {
    const fetchAdminDetails = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/auth/admin/details', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdminData(res.data);
        setFormData({ name: res.data.name, email: res.data.email });
      } catch (error) {
        console.error('Error fetching admin details:', error);
      }
    };

    fetchAdminDetails();
  }, []);

  // Handle profile update
  const handleProfileUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put('http://localhost:5000/api/auth/admin/update', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        alert('Profile updated successfully!');
        setAdminData(res.data.admin);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put('http://localhost:5000/api/auth/admin/change-password', passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        alert(res.data.msg);
        setPasswordData({ currentPassword: '', newPassword: '' });
      }
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      window.location.href = "/adminLogin";
    }
  };

  const location = useLocation();  // Using useLocation hook to get current pathname

  return (
    <div className="admin-settings flex">
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
            {/* <SidebarLink icon={<FaWallet />} label="Reports" path="/adminReports" activePath={location.pathname} /> */}
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
        {/* Profile Update Section */}
        <main className="flex-1 p-8">

        <div className="profile-section mb-8">
          <h3 className="text-lg font-semibold mb-4">Profile Update</h3>
          <label className="block mb-2">
            Name:
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </label>
          <label className="block mb-2">
            Email:
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </label>
          <label className="block mb-2">
            Role:
            <input
              type="text"
              value="Administrator"
              disabled
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </label>
          <button
            onClick={handleProfileUpdate}
            className="bg-red-600 text-white p-2 rounded-md mt-4"
          >
            Update Profile
          </button>
        </div>

        {/* Password Change Section */}
        <div className="password-section">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          <label className="block mb-2">
            Current Password:
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </label>
          <label className="block mb-2">
            New Password:
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </label>
          <button
            onClick={handleChangePassword}
            className="bg-red-600 text-white p-2 rounded-md mt-4"
          >
            Change Password
          </button>
        </div>        </main>

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

export default AdminSettings;
