const mongoose = require("mongoose");
const config = require('config');
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true,
  },
  spotify_auth_token: {
    timeCreated: {
      type: Date,
    },
    token: {
      type: String,
      default: ""      
    }
  },
  spotify_refresh_token: {
    type: String,
    default: ""
  },
  apple_auth_token: {
    type: String,
    default: ""
  },
  apple_refresh_token: {
    type: String,
    default: ""
  }
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({_id: this._id, email: this.email}, config.get("jwtPrivateKey"));
};

const User = new mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().email().min(1).max(100).required(),
    password: Joi.string().min(5).max(150).required(),
  });

  return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;
