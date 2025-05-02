import React, { useState } from "react";
import { FaLock, FaUserAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileSetup from "./ProfileSetup";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        phone,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));  


      if (!res.data.user.profileCompleted) {
        navigate("/setup-profile"); // redirect to profile setup
      } else {
        navigate("/dashboard"); // main app page
      }
    } catch (err) {
      setMsg(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fbe8dc]  p-8">
      {/* Left Section */}
      <div className
      ="flex-1 flex items-center">
        <div className="max-w-md space-y-6">
          <h1 className="text-4xl font-bold">Welcome Back!</h1>
          <p className="text-gray-600">
            Enter your details to login to your Banking Dashboard again!
          </p>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 bg-white rounded-xl p-8 shadow-md max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-red-600 mb-6">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-red-600 cursor-pointer">Forgot?</span>
          </div>

          <button type="submit" className="w-full bg-red-600 text-white py-2 rounded font-semibold mt-4">
            Login
          </button>

          {msg && <p className="text-center text-red-500 text-sm mt-2">{msg}</p>}
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-red-600 font-semibold">
            Register
          </Link>
        </p>
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

export default Login;
