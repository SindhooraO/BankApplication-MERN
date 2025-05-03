const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const AdminLogin = require('../models/AdminLogin');
const protect = require('../middleware/authMiddleware'); // Use the correct middleware
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const AccountDetails = require("../models/AccountDetails");
// Get Admin Details
router.get('/details', protect, async (req, res) => { // Use protect middleware
  try {
    const admin = await AdminLogin.findById(req.user.id).select('-password'); // Use req.user
    res.json(admin);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Update Profile Information
router.put('/update', protect, async (req, res) => { // Use protect middleware
  const { name, email } = req.body;
  try {
    const admin = await AdminLogin.findById(req.user.id); // Use req.user
    if (name) admin.name = name;
    if (email) admin.email = email;
    await admin.save();
    res.json({ success: true, admin });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Change Password
router.put('/change-password', protect, async (req, res) => { // Use protect middleware
  const { currentPassword, newPassword } = req.body;
  try {
    const admin = await AdminLogin.findById(req.user.id); // Use req.user
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) return res.status(400).json({ msg: 'Current password is incorrect' });

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();
    res.json({ success: true, msg: 'Password updated successfully' });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
