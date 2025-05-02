import React, { useState, useEffect } from "react";
import { FaHome, FaWallet, FaExchangeAlt, FaMoneyBillWave, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    state: "",
    city: "",
    zip: "",
    gender: "",
    linkedAccountNo: "",
    dob: "",
    phone: "",
    image: "", // This will store either URL string or file object
  });

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/auth/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        console.log("PROFILE:", response.data);
        setUserData(response.data);
        setPreviewImage(response.data.image ? `http://localhost:5000/${response.data.image}` : require("../assets/prof.jpg"));
    } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // Preview new image
      setUserData((prev) => ({
        ...prev,
        image: file, // Save file in userData
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      for (let key in userData) {
        formData.append(key, userData[key]);
      }

      const response = await axios.put("http://localhost:5000/api/auth/user/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      alert("Profile updated successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  return (
    <div className="flex min-h-screen text-gray-800">
      {/* Sidebar */}
      <Sidebar handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar userData={userData} previewImage={previewImage} />

        {/* Profile Form */}
        <main className="flex-1 p-8 bg-[#fbe8dc]">
          <h1 className="text-3xl font-bold text-gray-700 mb-6">Profile</h1>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl space-y-6 max-w-3xl mx-auto border border-rose-200">
            <div className="flex flex-col items-center gap-4">
              <img
                src={previewImage || require("../assets/prof.jpg")}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover shadow-md"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm text-gray-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="First Name" name="firstName" value={userData.firstName} onChange={handleChange} />
              <Input label="Last Name" name="lastName" value={userData.lastName} onChange={handleChange} />
              <Input label="Phone" name="phone" value={userData.phone} onChange={handleChange} disabled />
              <Input label="Date of Birth" name="dob" value={userData.dob ? userData.dob.split('T')[0] : ''} onChange={handleChange} type="date" />
              <Input label="Address" name="address" value={userData.address} onChange={handleChange} />
              <Input label="City" name="city" value={userData.city} onChange={handleChange} />
              <Input label="State" name="state" value={userData.state} onChange={handleChange} />
              <Input label="Zip" name="zip" value={userData.zip} onChange={handleChange} />
              <Input label="Gender" name="gender" value={userData.gender} onChange={handleChange} />
              <Input label="Linked Account No" name="linkedAccountNo" value={userData.linkedAccountNo} onChange={handleChange} disabled />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-full transition-all"
              >
                Update Profile
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

const Sidebar = ({ handleLogout }) => (
  <aside className="w-64 min-h-screen bg-[#fbe8dc] border-r-4 border-red-700 p-6 flex flex-col justify-between shadow-2xl">
    <div>
      <div className="flex items-center gap-2 mb-8">
        <img src={require("../assets/bank.png")} alt="logo" className="h-6" />
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
);

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

const Topbar = ({ userData, previewImage }) => (
  <div className="flex justify-end items-center p-4 bg-[#fbe8dc] shadow-md">
    <div className="flex items-center gap-4">
      <span className="font-semibold text-red-600">{userData.firstName || "User"}</span>
      <img
        src={previewImage || require("../assets/prof.jpg")}
        alt="Profile"
        className="w-8 h-8 rounded-full object-cover"
      />
    </div>
  </div>
);

const Input = ({ label, name, value, onChange, type = "text", disabled = false }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all"
    />
  </div>
);

export default Profile;
