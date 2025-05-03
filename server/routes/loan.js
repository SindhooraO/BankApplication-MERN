// routes/loan.js
const express = require("express");
const router = express.Router(); // Ensure router is initialized correctly
const { generateLoanRecommendation } = require("../controllers/loanController");
const authMiddleware = require("../middleware/authMiddleware");
const LoanApplication = require("../models/LoanApplication");

router.get("/recommendation", authMiddleware, async (req, res) => {
  try {
    const recommendation = await generateLoanRecommendation(req.user.id);
    res.json(recommendation || {});
  } catch (error) {
    console.error("Loan recommendation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/apply", authMiddleware, async (req, res) => {
    try {
      const { loanType, amount, riskScore,status } = req.body;
      const userId = req.user.id;
  
      const newLoan = new LoanApplication({
        user: userId,
        loanType,
        amount,
        riskScore,
        status,
      });
  
      await newLoan.save();
      res.status(201).json({ message: "Loan application saved successfully" });
    } catch (err) {
      console.error("Error saving loan:", err);
      res.status(500).json({ error: "Failed to save loan application" });
    }
  });
  router.get("/all", authMiddleware,async (req, res) => {
    try {
      const applications = await LoanApplication.find()
        .populate("user", "name ") // Populate user name
        .sort({ date: -1 });
      res.json(applications);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // UPDATE loan status
  router.put("/update/:id",authMiddleware, async (req, res) => {
    const { status } = req.body;
    try {
      const updated = await LoanApplication.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Status update failed" });
    }
  });
  
// Get the latest loan application status for the current user
// Get the latest loan application status for the current user
router.get("/status", authMiddleware, async (req, res) => {
    try {
      const latestApplication = await LoanApplication.findOne({ user: req.user.id })
        .sort({ date: -1 });
  
      if (!latestApplication) {
        return res.status(404).json({ message: "No loan application found" });
      }
  
      res.json({ status: latestApplication.status });
    } catch (err) {
      console.error("Error fetching loan status:", err);
      res.status(500).json({ message: "Failed to fetch loan status" });
    }
  });

  router.get("/user/count", authMiddleware, async (req, res) => {
    try {
      const count = await LoanApplication.countDocuments({ user: req.user.id });
      res.json({ count });
    } catch (err) {
      console.error("Error fetching loan count:", err);
      res.status(500).json({ message: "Failed to fetch loan count" });
    }
  });
  
  
  
module.exports = router; // Make sure you're exporting the router correctly
