import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaWallet, FaExchangeAlt, FaMoneyBillWave, FaUser, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import bankLogo from "../assets/bank.png";
import defaultProfile from "../assets/prof.jpg";
import { format, startOfWeek, startOfMonth } from "date-fns"; // For date manipulation

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

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [userName, setUserName] = useState("");
  const [previewImage, setPreviewImage] = useState(defaultProfile);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filter, setFilter] = useState("all"); // Default filter: 'all'
  const totalBalance = transactions.reduce((acc, tx) => acc + tx.amount, 0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, filter]);

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
    } catch (error) {
      console.error("Transaction fetch error:", error);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];
    const currentDate = new Date();

    switch (filter) {
      case "week":
        const startOfThisWeek = startOfWeek(currentDate);
        filtered = filtered.filter(tx => new Date(tx.date) >= startOfThisWeek);
        break;
      case "month":
        const startOfThisMonth = startOfMonth(currentDate);
        filtered = filtered.filter(tx => new Date(tx.date) >= startOfThisMonth);
        break;
      case "older":
        filtered = filtered.filter(tx => new Date(tx.date) < startOfMonth(currentDate));
        break;
      default:
        break;
    }

    setFilteredTransactions(filtered);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      navigate("/login");
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
          <h2 className="text-3xl font-bold mb-6">Transactions</h2>

          {/* Main Account Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg flex items-center justify-between hover:shadow-2xl transition">
            <div>
              <h3 className="text-lg font-semibold text-red-600">Main Account</h3>
              <p className="text-3xl font-bold mt-2">
                ₹ {totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Filter Options with Professional Styling */}
          <div className="mt-8 mb-4 grid grid-cols-4 gap-4">
            {["all", "week", "month", "older"].map((filterOption) => (
              <div
                key={filterOption}
                onClick={() => handleFilterChange(filterOption)}
                className={`cursor-pointer text-center py-2 rounded-lg shadow-md transition-all duration-300
                  ${filter === filterOption ? "bg-red-600 text-white" : "bg-white text-red-600 border border-red-600 hover:bg-red-600 hover:text-white"}`}
              >
                {filterOption === "all" && "All Transactions"}
                {filterOption === "week" && "This Week"}
                {filterOption === "month" && "This Month"}
                {filterOption === "older" && "Older"}
              </div>
            ))}
          </div>

          {/* Transactions */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Transactions</h3>
            <div className="bg-white rounded-lg shadow-md p-4 space-y-4 max-h-[300px] overflow-y-auto">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx, idx) => (
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
        </main>
      </div>
    </div>
  );
};

export default Transactions;
