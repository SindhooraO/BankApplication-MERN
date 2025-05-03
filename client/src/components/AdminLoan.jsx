import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaHome,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaUsers, FaEnvelope
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const AdminLoan = () => {
  const [loanApplications, setLoanApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName] = useState("Admin");
  const [previewImage] = useState(null);
  const location = useLocation();

  const fetchLoanApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/loan/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoanApplications(data);
    } catch (err) {
      console.error("Error fetching loan applications:", err);
      setError("Failed to load loan applications.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/loan/update/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLoanApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status: newStatus } : app
        )
      );
      await fetchLoanApplications(); // after status update

    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  useEffect(() => {
    fetchLoanApplications();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      window.location.href = "/adminLogin";
    }
  };

  return (
    <div className="flex">
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

      {/* Main content */}
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

        {/* Loan Applications Table */}
        <main className="p-6">
          <h2 className="text-3xl font-bold mb-4 text-red-600">Loan Applications</h2>
          {loading ? (
            <p>Loading applications...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : loanApplications.length === 0 ? (
            <p>No loan applications found.</p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full bg-white border rounded-xl shadow-md">
                <thead className="bg-red-100 text-left">
                  <tr>
                    <th className="py-2 px-4">User</th>
                    <th className="py-2 px-4">Loan Type</th>
                    <th className="py-2 px-4">Amount</th>
                    <th className="py-2 px-4">Risk Score</th>
                    <th className="py-2 px-4">Date</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loanApplications.map((app) => (
                    <tr key={app._id} className="border-t hover:bg-gray-50">
                      <td className="py-2 px-4">{app.user?.name || "Unknown"}</td>
                      <td className="py-2 px-4">{app.loanType}</td>
                      <td className="py-2 px-4">₹ {app.amount.toLocaleString("en-IN")}</td>
                      <td className="py-2 px-4">{app.riskScore}</td>
                      <td className="py-2 px-4">
                        {new Date(app.date).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 font-semibold">{app.status}</td>
                      <td className="py-2 px-4 space-x-2">
                        <button
                          onClick={() => updateStatus(app._id, "Approved")}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(app._id, "Rejected")}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
      className={`flex items-center gap-3 px-2 py-2 rounded-md ${isActive ? "bg-red-200 text-red-800 font-semibold" : "text-gray-800 hover:text-red-600"} transition-all`}
    >
      {icon} {label}
    </Link>
  );
};

export default AdminLoan;
