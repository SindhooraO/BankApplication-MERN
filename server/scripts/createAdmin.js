// // scripts/createAdmin.js
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const Admin = require('../models/AdminLogin');

// mongoose.connect('mongodb://localhost:27017/bankly', { useNewUrlParser: true, useUnifiedTopology: true });

// (async () => {
//   const hashedPassword = await bcrypt.hash('Admin@1234', 10);
//   await Admin.create({ email: 'admin@bank.com', password: hashedPassword });
//   console.log('✅ Admin user created');
//   process.exit();
// })();
