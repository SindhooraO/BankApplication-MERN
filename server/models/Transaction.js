// models/Transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 👈 add this
  type: { type: String, enum: ['Deposit', 'Withdraw'], required: true },
  amount: { type: Number, required: true },
  method: { type: String },
  accountNumber: { type: String },
  accountName: { type: String },
  bank: { type: String },
  date: { type: String },
  time: { type: String },
});

module.exports = mongoose.model('Transaction', transactionSchema);
