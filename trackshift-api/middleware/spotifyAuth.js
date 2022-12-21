const config = require("config");
const SpotifyWebApi = require("spotify-web-api-node");
const { User } = require("../models/user");

module.exports = async function (req, res, next) {
  let user = await User.findById(req.user._id);

  if (user.spotify_auth_token.token === "")
    return res
      .status(401)
      .send("Access denied. User is not authorized by Spotify.");

  req.user = user;
  const timeElapsed = (Date.now() - user.spotify_auth_token.timeCreated) / 1000;
  if (timeElapsed >= 3300) req.user = await refreshAccessToken(user);

  next();
};

async function refreshAccessToken(user) {
  const spotifyApi = new SpotifyWebApi({
    clientId: config.get("spotify_client_id"),
    clientSecret: config.get("spotify_client_secret"),
    refreshToken: user.spotify_refresh_token,
  });

  const { body } = await spotifyApi.refreshAccessToken();
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      spotify_auth_token: {
        timeCreated: Date.now(),
        token: body.access_token,
      },
    },
    { new: true }
  );

  return updatedUser;
}
