const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
// Import your admin auth route
const adminAuthRoutes = require('./routes/adminAuth');


const app = express();

// Apply CORS first
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

//  Middleware
app.use(express.json());

//  Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use("/uploads", express.static("uploads"));

//  Routes
const authRoutes = require('./routes/authRoutes');
const account = require('./routes/account');
const admin = require('./routes/admin');
const loanRoutes = require("./routes/loan");
const contactRoutes = require("./routes/contact");


app.use('/api/account', account);
app.use('/api/auth', authRoutes);        // Login/Register
// Mount the route
app.use('/api/admin', adminAuthRoutes);// So /api/admin/login will work
app.use('/api/auth/admin', admin);
app.use("/api/loan", loanRoutes);
app.use("/api/contact", contactRoutes);


//  MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(" MongoDB connected"))
.catch((err) => console.error(" MongoDB connection error:", err));



//  Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
