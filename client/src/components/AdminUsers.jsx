import React, { useState, useEffect } from "react";
import {
  FaHome, FaMoneyBillWave, FaExchangeAlt, FaUser, FaSignOutAlt,
  FaWallet, FaCog, FaUsers, FaRedoAlt
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const AdminUsers = () => {
  const [userName, setUserName] = useState("Admin");
  const [previewImage, setPreviewImage] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/auth/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      window.location.href = "/adminLogin";
    }
  };

  const handleUserDetails = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedUser(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="flex min-h-screen  text-gray-800 font-sans">
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
        <div className="flex justify-between items-center p-4 ">
          <div className="text-lg font-semibold text-red-600">
            {/* Welcome, {userName} */}
          </div>
          <div className="flex items-center gap-4">
          <span className="font-semibold text-red-600 text-md">{userName}</span>

            <img
              src={previewImage || require("../assets/prof.jpg")}
              alt="Admin"
              className="w-9 h-9 rounded-full object-cover border-2 border-red-600"
            />
          </div>
        </div>

        {/* Main Section */}
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">All Users</h2>
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-500">
                Total Users: <span className="font-semibold">{users.length}</span>
              </p>
              {/* <button
                onClick={fetchUsers}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center gap-2"
              >
                <FaRedoAlt /> Refresh
              </button> */}
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" className="text-center p-6 text-gray-400">Loading...</td></tr>
                ) : users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50 transition">
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.phone}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleUserDetails(user._id)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-6 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {showModal && selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl overflow-y-auto max-h-[90vh]">
                <h3 className="text-xl font-bold text-gray-800 mb-4">User Details</h3>
                <table className="w-full text-sm mb-4">
                  <tbody>
                    <tr>
                      <td className="py-2 font-medium">Profile</td>
                      <td className="py-2">
                        <img
                          src={`http://localhost:5000/${selectedUser.image}`}
                          alt="User"
                          className="w-24 h-24 object-cover rounded-full border"
                        />
                      </td>
                    </tr>
                    <tr><td className="py-2 font-medium">Name</td><td className="py-2">{selectedUser.firstName} {selectedUser.lastName}</td></tr>
                    <tr><td className="py-2 font-medium">Phone</td><td className="py-2">{selectedUser.phone}</td></tr>
                    <tr><td className="py-2 font-medium">Address</td><td className="py-2">{selectedUser.address}</td></tr>
                    <tr><td className="py-2 font-medium">City</td><td className="py-2">{selectedUser.city}</td></tr>
                    <tr><td className="py-2 font-medium">State</td><td className="py-2">{selectedUser.state}</td></tr>
                    <tr><td className="py-2 font-medium">Zip</td><td className="py-2">{selectedUser.zip}</td></tr>
                    <tr><td className="py-2 font-medium">DOB</td><td className="py-2">{new Date(selectedUser.dob).toLocaleDateString()}</td></tr>
                    <tr><td className="py-2 font-medium">Gender</td><td className="py-2">{selectedUser.gender}</td></tr>
                    <tr><td className="py-2 font-medium">Linked Account</td><td className="py-2">{selectedUser.linkedAccountNo}</td></tr>
                    <tr><td className="py-2 font-medium">Profile Completed</td><td className="py-2">{selectedUser.profileCompleted ? "Yes" : "No"}</td></tr>
                  </tbody>
                </table>
                <div className="flex justify-end">
                  <button onClick={closeModal} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
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
export default AdminUsers;
