import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const token = localStorage.getItem('token');

const ProfileSetup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    image: null,
    address: '',
    city: '',
    state: '',
    zip: '',
    linkedAccountNo: '',
    phone: '',
    gender: '',
    dob: ''
  });

  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/auth/user/setup-profile',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          // withCredentials: true
        }
      );

      setMsg("Profile updated successfully!");
      alert("Profile updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.msg || "Profile update failed");
      alert("Profile update failed. Check console for error.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbe8dc] p-6">
      <form
        className="bg-white p-6 rounded-xl shadow-md space-y-4 max-w-xl w-full"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold text-red-600">Complete Your Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="firstName" placeholder="First Name" className="border p-2 rounded" value={formData.firstName} onChange={handleChange} required />
          <input name="lastName" placeholder="Last Name" className="border p-2 rounded" value={formData.lastName} onChange={handleChange} required />
          <input name="address" placeholder="Address" className="border p-2 rounded" value={formData.address} onChange={handleChange} required />
          <input name="city" placeholder="City" className="border p-2 rounded" value={formData.city} onChange={handleChange} required />
          <input name="state" placeholder="State" className="border p-2 rounded" value={formData.state} onChange={handleChange} required />
          <input name="zip" placeholder="Zip Code" className="border p-2 rounded" value={formData.zip} onChange={handleChange} required />
          <input  name="linkedAccountNo" placeholder="Link Existing Account No." className="border p-2 rounded" value={formData.linkedAccountNo} onChange={handleChange} required/>
          <input name="phone" placeholder="Phone Number" className="border p-2 rounded" value={formData.phone} onChange={handleChange} required />
          <input name="dob" type="date" className="border p-2 rounded" value={formData.dob} onChange={handleChange} required/>
          <select name="gender" className="border p-2 rounded" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input type="file" name="image" accept="image/*" className="border p-2 rounded md:col-span-2" onChange={handleChange} />
        </div>
        <button type="submit" className="bg-red-600 text-white py-2 px-4 rounded w-full">Submit</button>
        {msg && <p className="text-center text-red-500 mt-2">{msg}</p>}
      </form>
    </div>
  );
};

export default ProfileSetup;
