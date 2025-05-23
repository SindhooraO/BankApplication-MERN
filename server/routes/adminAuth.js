// routes/adminAuth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AdminLogin = require("../models/AdminLogin");
const Transaction = require("../models/Transaction");
const User = require("../models/User"); 


router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await AdminLogin.findOne({ email });

  if (!admin) {
    console.log("Admin not found:", email);
    return res.status(403).json({ msg: "Unauthorized" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    console.log("Invalid password for:", email);
    return res.status(400).json({ msg: "Invalid credentials" });
  }

  console.log("Admin login success:", email);
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
  res.json({ token, user: admin });
});
// Get all transactions
router.get('/admin/transactions', async (req, res) => {
  try {
    // Fetching transactions and populating user field to get linkedAccountNo
    const transactions = await Transaction.find()
      .populate({
        path: 'user',  // Refers to the User model
        select: 'linkedAccountNo firstName lastName phone',  // Fetch the linkedAccountNo and other user details if needed
      })
      .exec();

    res.json(transactions); // Respond with populated transactions
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = router;
