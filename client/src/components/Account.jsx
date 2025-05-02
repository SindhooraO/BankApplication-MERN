import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaWallet, FaExchangeAlt, FaMoneyBillWave, FaUser, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";

import DepositModal from "../components/DepositModal";
import WithdrawModal from "../components/WithdrawModal";
import bankLogo from "../assets/bank.png";
import defaultProfile from "../assets/prof.jpg";

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

const Account = () => {
  const [transactions, setTransactions] = useState([]); // All transactions for balance calculation
  const [sortedTransactions, setSortedTransactions] = useState([]); // Sorted transactions for display
  const [userName, setUserName] = useState("");
  const [previewImage, setPreviewImage] = useState(defaultProfile);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const navigate = useNavigate();

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

      setTransactions(data); // Set all transactions for balance calculation

      // Sort transactions by date in descending order and slice to get the latest 10
      const sortedTransactions = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setSortedTransactions(sortedTransactions.slice(0, 5)); // Show only the latest 10 transactions
    } catch (error) {
      console.error("Transaction fetch error:", error);
    }
  };

  const handleDeposit = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/account/deposit", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTransactions();
      setShowDepositModal(false);
    } catch (error) {
      console.error("Deposit error:", error);
      alert(error.response?.data?.message || "Deposit failed");
    }
  };

  const handleWithdraw = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/account/withdraw", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTransactions();
      setShowWithdrawModal(false);
    } catch (error) {
      console.error("Withdraw error:", error);
      alert(error.response?.data?.message || "Withdraw failed");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  // Calculate total balance from all transactions
  const totalBalance = transactions.reduce((acc, tx) => acc + tx.amount, 0);

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
            <Link to="/profile">
              <img
                src={previewImage}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover cursor-pointer hover:opacity-80 transition"
              />
            </Link>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-8 bg-[#fbe8dc]">
          <h2 className="text-3xl font-bold mb-6">Account</h2>

          {/* Main Account Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg flex items-center justify-between hover:shadow-2xl transition">
            <div>
              <h3 className="text-lg font-semibold text-red-600">Main Account</h3>
              <p className="text-3xl font-bold mt-2">
                ₹ {totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDepositModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full transition text-sm md:text-base"
              >
                Deposit
              </button>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-full transition text-sm md:text-base"
              >
                Withdraw
              </button>
            </div>
          </div>

          {/* Transactions */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
            <div className="bg-white rounded-lg shadow-md p-4 space-y-4 max-h-[300px] overflow-y-auto">
              {sortedTransactions.length > 0 ? (
                sortedTransactions.map((tx, idx) => (
                  <div key={idx} className="flex justify-between items-center text-gray-700">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                          tx.amount > 0 ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {tx.amount > 0 ? "+" : "-"}
                      </div>
                      <div>
                        <div className="font-semibold">{tx.accountName || "You"}</div>
                        <div className="text-sm">{tx.method || tx.bank}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        {tx.date} – {tx.time}
                      </div>
                      <div
                        className={`font-bold ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {tx.amount > 0 ? `+₹${tx.amount}` : `-₹${Math.abs(tx.amount)}`}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center">No transactions found.</p>
              )}
            </div>
          </div>

          {/* Modals */}
          {showDepositModal && (
            <DepositModal onClose={() => setShowDepositModal(false)} onSubmit={handleDeposit} />
          )}
          {showWithdrawModal && (
            <WithdrawModal onClose={() => setShowWithdrawModal(false)} onSubmit={handleWithdraw} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Account;
