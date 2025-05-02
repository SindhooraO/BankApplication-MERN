const express = require("express");
const router = express.Router();
const { register, login, setupProfile,  getUserProfile, updateUserProfile ,getRecentUsers,
     getDashboardStats,getAllUsers, getUserDetails } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const multer = require("multer");
const path = require("path");




router.post("/register", register);
router.post("/login", login);
router.put("/user/setup-profile", authMiddleware, upload.single("image"), setupProfile);
router.get("/user/profile", authMiddleware, getUserProfile);
router.put("/user/update-profile", authMiddleware, upload.single("image"), updateUserProfile);
router.get('/admin/recent-users',  authMiddleware,getRecentUsers);  
router.get("/admin/dashboard-stats", authMiddleware,getDashboardStats);
router.get('/admin/users',  authMiddleware, getAllUsers);
router.get('/admin/users/:userId',  authMiddleware, getUserDetails);
module.exports = router;
