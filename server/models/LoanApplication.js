// models/LoanApplication.js
const mongoose = require("mongoose");

const loanApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  loanType: String,
  amount: Number,
  riskScore: String,
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["Applied", "Approved", "Rejected"] },

});

module.exports = mongoose.model("LoanApplication", loanApplicationSchema);
