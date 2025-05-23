const express = require('express');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const AccountDetails = require('../models/AccountDetails');
const authMiddleware = require('../middleware/authMiddleware'); // create this!
const AdminLogin = require('../models/AdminLogin.js'); // MongoDB model

const router = express.Router();

// Deposit route
// Deposit route
router.post('/deposit', authMiddleware, async (req, res) => { 
  try {
    const { amount, method } = req.body;
    const now = new Date();

    // Create a new transaction
    const transaction = new Transaction({
      user: req.user.id,
      type: 'Deposit',
      amount,
      method,
      date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    });

    await transaction.save();

    // Update the user's account details (balance, totalDeposits)
    const accountDetails = await AccountDetails.findOne({ user: req.user.id });

    if (!accountDetails) {
      // If no account details exist, create them
      await AccountDetails.create({
        user: req.user.id,
        balance: amount,
        totalDeposits: amount,
        totalWithdrawals: 0
      });
    } else {
      // Update existing account details
      accountDetails.balance += amount;
      accountDetails.totalDeposits += amount;
      await accountDetails.save(); // Save the updated account details
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ message: 'Deposit failed' });
  }
});


// Withdraw route
router.post('/withdraw', authMiddleware, async (req, res) => {
  try {
    const { amount, accountNumber, accountName, bank } = req.body;

    if (!amount || !accountNumber || !accountName || !bank) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const user = await User.findById(req.user.id); 

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.linkedAccountNo !== accountNumber) {
      return res.status(400).json({ message: 'Account number does not match your linked account.' });
    }

    const accountDetails = await AccountDetails.findOne({ user: req.user.id });

    if (!accountDetails || accountDetails.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance.' });
    }

    const now = new Date();

    // Create a new transaction
    const transaction = new Transaction({
      user: req.user.id,
      type: 'Withdraw',
      amount: -Math.abs(amount), 
      accountNumber,
      accountName,
      bank,
      date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    });

    await transaction.save();

    // Update the user's account details (balance, totalWithdrawals)
    accountDetails.balance -= amount; // Subtract withdrawal amount from balance
    accountDetails.totalWithdrawals += amount;
    await accountDetails.save(); // Save updated account details

    res.status(200).json(transaction);
  } catch (error) {
    console.error('Withdraw error:', error);
    res.status(500).json({ message: 'Withdraw failed' });
  }
});


// Get Transactions
router.get('/transactions', authMiddleware, async (req, res) => { 
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ _id: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Transactions fetch error:', error);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

// Get Account Details for a user
router.get('/account-details', authMiddleware, async (req, res) => {
  try {
    const accountDetails = await AccountDetails.findOne({ user: req.user.id });
    if (!accountDetails) {
      return res.status(404).json({ message: 'Account details not found' });
    }
    res.status(200).json(accountDetails);
  } catch (error) {
    console.error('Error fetching account details:', error);
    res.status(500).json({ message: 'Error fetching account details' });
  }
});

module.exports = router;
