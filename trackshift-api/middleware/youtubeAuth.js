const config = require("config");
const { User } = require("../models/user");

module.exports = async function (req, res, next) {
  let user = await User.findById(req.user._id);

  if (user.youtube_auth_token.token === "")
    return res
      .status(401)
      .send("Access denied. User is not authorized by YouTube.");

  req.user = user;
  next();
};