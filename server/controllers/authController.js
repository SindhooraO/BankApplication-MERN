const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, phone, password } = req.body;
  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) return res.status(400).json({ msg: "Phone already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, phone, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

exports.login = async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: user._id, name: user.name, phone: user.phone,profileCompleted: user.profileCompleted,  } });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

exports.setupProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      address,
      zip,
      city,
      state,
      gender,
      linkedAccountNo,
      dob
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.firstName = firstName;
    user.lastName = lastName;
    user.address = address;
    user.zip = zip;
    user.city = city;
    user.state = state;
    user.gender = gender;
    user.linkedAccountNo = linkedAccountNo;
    user.dob = dob;

    if (req.file) {
      user.image = req.file.path; // Save the path
    }

    user.profileCompleted = true;

    await user.save();

    res.status(200).json({ msg: "Profile setup successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    
    const user = await User.findById(req.user.id).select("name firstName lastName gender dob image phone address state city zip linkedAccountNo");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);  // Send only linkedAccountNo
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Comes from protect middleware
    const {
      firstName,
      lastName,
      address,
      state,
      city,
      zip,
      gender,
      dob,
    } = req.body;

    const updatedFields = {
      firstName,
      lastName,
      address,
      state,
      city,
      zip,
      gender,
      dob,
    };

    if (req.file) {
      updatedFields.image = `uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

exports.getRecentUsers = async (req, res) => {
  try {
    const recentUsers = await User.find()  // Fetch users from the database
      .sort({ _id: -1 })  // Sort by descending order of creation (most recent first)
      .limit(5);  // Limit the number of users, adjust as needed
    res.status(200).json(recentUsers);
  } catch (error) {
    console.error("Error fetching recent users:", error);
    res.status(500).json({ message: "Error fetching recent users" });
  }
};
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments(); // count total users
    // const approvedLoans = await Loan.countDocuments({ status: 'approved' });
    // const rejectedLoans = await Loan.countDocuments({ status: 'rejected' });
    // const pendingLoans = await Loan.countDocuments({ status: 'pending' });

    res.status(200).json({
      totalUsers,
      // approvedLoans,
      // rejectedLoans,
      // pendingLoans,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Controller to fetch a single user's details by ID
exports.getUserDetails = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId); // Fetch user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user); // Return user details
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details", error });
  }
};