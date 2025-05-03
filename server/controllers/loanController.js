// controllers/loanController.js
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getCreditMultiplier = (rating) => {
  switch (rating) {
    case "Excellent": return 2;
    case "Good": return 1;
    case "Average": return 0;
    case "Poor": return -1;
    default: return 0;
  }
};

exports.generateLoanRecommendation = async (userId) => {
  const transactions = await Transaction.find({ userId }).sort({ date: 1 });

  if (transactions.length === 0) return null;

  const monthlyMap = {};
  let totalDeposits = 0;
  let totalWithdrawals = 0;

  // Process transactions to calculate monthly deposits and withdrawals
  transactions.forEach((tx) => {
    const amount = tx.amount;
    const date = new Date(tx.date);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

    if (!monthlyMap[key]) {
      monthlyMap[key] = { deposits: 0, withdrawals: 0 };
    }

    if (amount > 0) {
      monthlyMap[key].deposits += amount;
      totalDeposits += amount;
    } else {
      monthlyMap[key].withdrawals += Math.abs(amount);
      totalWithdrawals += Math.abs(amount);
    }
  });

  // Calculate average monthly deposits, withdrawals, and risk score
  const months = Object.keys(monthlyMap).length || 1;
  const avgMonthlyDeposit = totalDeposits / months;
  const avgMonthlyWithdrawal = totalWithdrawals / months;
  const riskScore = avgMonthlyWithdrawal / (avgMonthlyDeposit || 1);

  // Determine loan type based on risk score
  let baseMultiplier = 2;
  let loanType = "Cautioned Loan";

  if (riskScore < 0.4) {
    baseMultiplier = 6;
    loanType = "Premium Loan";
  } else if (riskScore < 0.7) {
    baseMultiplier = 4;
    loanType = "Standard Loan";
  }

  // Fetch user data, including credit rating
  const user = await User.findById(userId);
  let creditRating = user?.creditRating || "Average"; // Default to "Average" if no rating found

  // Get credit multiplier based on credit rating
  const creditMultiplier = getCreditMultiplier(creditRating);

  // Calculate the final loan multiplier
  const finalMultiplier = Math.max(0, baseMultiplier + creditMultiplier);
  const recommendedAmount = avgMonthlyDeposit * finalMultiplier;

  // Update the user's credit rating based on risk score
  if (riskScore < 0.4 && creditRating !== "Excellent") {
    creditRating = "Excellent";  // Upgrade to Excellent if risk score is low
  } else if (riskScore < 0.7 && creditRating !== "Good") {
    creditRating = "Good";  // Upgrade to Good if risk score is moderate
  } else if (riskScore >= 0.7 && creditRating !== "Poor") {
    creditRating = "Poor";  // Downgrade to Poor if risk score is high
  }

  // Save the updated credit rating in the user's document
  user.creditRating = creditRating;
  await user.save();  // Save the updated user document

  // Return the loan recommendation details
  return {
    amount: recommendedAmount.toFixed(2),
    type: loanType,
    risk: riskScore.toFixed(2),
    avgMonthlyDeposit: avgMonthlyDeposit.toFixed(2),
    creditRating,  // Return updated credit rating
  };
};
