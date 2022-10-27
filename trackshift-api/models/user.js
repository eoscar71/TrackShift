const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    maxlength: 100,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true,
  },
});

const User = new mongoose.model("User", userModel);

module.exports.User = User;
