import React, { useState } from "react";
import { FaLock, FaUserAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/admin/login", {
        email,
        password,
      });

      if (!res.data.user.isAdmin) {
        setMsg("Access denied: Not an admin");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.user));
      navigate("/adminDashboard");
    } catch (err) {
      setMsg(err.response?.data?.msg || "Admin login failed");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fbe8dc] p-8">
      {/* Left Section */}
      <div className="flex-1 flex items-center">
        <div className="max-w-md space-y-6">
          <h1 className="text-4xl font-bold">Admin Portal</h1>
          <p className="text-gray-600">Enter your details to access the admin Dashboard.</p>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 bg-white rounded-xl p-8 shadow-md max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-red-600 mb-6">Admin Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />

          {/* <div className="flex justify-between items-center text-sm">
            <span className="text-red-600 cursor-pointer">Forgot?</span>
          </div> */}

          <button type="submit" className="w-full bg-red-600 text-white py-2 rounded font-semibold mt-4">
            Login
          </button>

          {msg && <p className="text-center text-red-500 text-sm mt-2">{msg}</p>}
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, type = "text", value, onChange }) => (
  <div>
    <label className="block text-sm mb-1">{label}</label>
    <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 mb-4 mt-1">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={`Enter your ${label}`}
        className="flex-1 outline-none"
        required
      />
      {type === "password" ? <FaLock className="text-gray-500" /> : <FaUserAlt className="text-gray-500" />}
    </div>
  </div>
);

export default AdminLogin;
