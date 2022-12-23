const config = require("config");
const { User } = require("../models/user");

module.exports = async function (req, res, next) {
  let user = await User.findById(req.user._id);

  if (user.deezer_auth_token === "")
    return res
      .status(401)
      .send("Access denied. User is not authorized by Deezer.");

  req.user = user;
  next();
};