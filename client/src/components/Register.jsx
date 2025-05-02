import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const validatePhone = (phone) => {
    const phonePattern = /^[6-9]\d{9}$/; // Matches a 10-digit phone number starting with 6-9 (Indian format)
    return phonePattern.test(phone);
  };

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?]).{8,}$/;
    // Password must have at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long
    return passwordPattern.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;

    // Reset errors
    setPhoneError("");
    setPasswordError("");

    // Validate phone number
    if (!validatePhone(phone)) {
      setPhoneError("Phone number must be 10 digits long and start with 6-9");
      valid = false;
    }

    // Validate password
    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one digit, and one special character.");
      valid = false;
    }

    // If validation fails, don't proceed
    if (!valid) return;

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        phone,
        password
      });
      setMsg(res.data.msg);
      navigate("/login");
    } catch (err) {
      setMsg(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fbe8dc] p-8">
      <div className="flex-1 flex items-center">
        <div className="max-w-md space-y-6">
          <h1 className="text-4xl font-bold">Experience hassle-free Banking</h1>
          <p className="text-gray-600">Say goodbye to long queues and complex procedures and hello to hassle-free banking with Bankly.</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl p-8 shadow-md max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-red-600 mb-6">Register</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input label="Name" value={name} onChange={e => setName(e.target.value)} />
          <Input
            label="Phone No"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            error={phoneError}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={passwordError}
          />
          <div className="text-sm text-gray-600">
            <input type="checkbox" className="mr-2" required />
            I agree to all the <span className="text-red-600">Terms, Privacy Policy and Fees</span>.
          </div>
          <button type="submit" className="w-full bg-red-600 text-white py-2 rounded">Register</button>
          {msg && <p className="text-sm text-center text-red-500">{msg}</p>}
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?
          <Link to="/login" className="text-red-600 font-semibold ml-1">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

const Input = ({ label, type = "text", value, onChange, error }) => (
  <div>
    <label className="block text-sm mb-1">{label}</label>
    <input
      type={type}
      placeholder={`Enter your ${label}`}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded px-3 py-2"
      required
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

export default Register;
