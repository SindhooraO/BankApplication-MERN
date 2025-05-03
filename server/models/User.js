// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   phone: { type: String, required: true, unique: true },
//   password: { type: String, required: true }
// });

// module.exports = mongoose.model("User", userSchema);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    phone: { type: String, unique: true },
    password: String,
    
    // Profile setup fields
    firstName: String,
    lastName: String,
    address: String,
    zip: String,
    city: String,
    state: String,
    gender: String,
    linkedAccountNo: String,
    dob: Date,
    image: String,

    profileCompleted: {
        type: Boolean,
        default: false
    },

});

module.exports = mongoose.model("User", userSchema);
