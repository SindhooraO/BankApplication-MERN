// models/AccountDetails.js
const mongoose = require("mongoose");

const accountDetailsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true  // One account per user
  },
  balance: {
    type: Number,
    default: 0
  },
  totalDeposits: {
    type: Number,
    default: 0
  },
  totalWithdrawals: {
    type: Number,
    default: 0
  },
}, { timestamps: true });

module.exports = mongoose.model("AccountDetails", accountDetailsSchema);
