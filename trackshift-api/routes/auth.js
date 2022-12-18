const express = require("express");
const request = require("request");
const config = require("config");
const bcrypt = require("bcrypt");
const querystring = require("querystring");
const { User, validate } = require("../models/user");
const userAuth = require("../middleware/userAuth");
const {google} = require('googleapis');
const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  config.get('youtube_client_id'),
  config.get('youtube_client_secret'),
  'http://localhost:3000/auth-redirect'
);

// User login endpoint
router.post("/users", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  res.send(user.generateAuthToken());
});

// Endpoint to begin Spotify auth process
router.get("/spotify", (req, res) => {
  let state = generateRandomString(16);
  let scope =
    "user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public";
  const redirect_uri = "http://localhost:3000/auth-redirect";
  res.cookie("platformToAuth", 'spotify');
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: config.get("spotify_client_id"),
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

// Endpoint to begin YouTube auth process
router.get('/youtube', (req, res) => {
  const scopes = [
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtube.force-ssl",
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtubepartner",
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', 
    scope: scopes
  });

  res.cookie('platformToAuth', 'youtube');
  res.redirect(url);
});

// Endpoint to begin Deezer auth process
router.get('/deezer', (req, res) => {
  const app_id = config.get('deezer_client_id');
  const redirect_uri = 'http://localhost:3000/auth-redirect';
  const perms = 'basic_access,offline_access,manage_library,listening_history';

  res.cookie('platformToAuth', 'deezer');
  res.redirect("https://connect.deezer.com/oauth/auth.php?" + 
  querystring.stringify({
    app_id: app_id,
    redirect_uri: redirect_uri,
    perms: perms
  }));
});

// Endpoint to finalize Deezer auth process (grab access token)
router.post('/deezer/callback', [userAuth], (req, res) => {
  const {code} = req.body;
  const url = 'https://connect.deezer.com/oauth/access_token.php?' +
    querystring.stringify({
      app_id: config.get('deezer_client_id'),
      secret: config.get('deezer_client_secret'),
      code: code,
      output: 'json'
    });
  request.post(url, async function (error, response, body) {
    const {access_token} = JSON.parse(body);
    const user = await User.findByIdAndUpdate(req.user._id, {
      deezer_auth_token: access_token
    });

    res.send(true);
    console.log("Completed Deezer auth.");
  });
});

// Endpoint to finalize YouTube auth process
router.post('/youtube/callback', [userAuth], async (req, res) => {
  const {code} = req.body;
  const {tokens} = await oauth2Client.getToken(code);
  const {access_token, refresh_token} = tokens;
  
  const user = await User.findByIdAndUpdate(req.user._id, {
    youtube_auth_token: {
      timeCreated: Date.now(),
      token: access_token,
      refreshToken: refresh_token
    }
  });
  res.send('Google Auth complete.');
});

// Endpoint to finalize Spotify auth process
router.post("/spotify/callback", [userAuth], (req, res) => {
  const redirect_uri = "http://localhost:3000/auth-redirect";
  let code = req.body.code || null;
  let state = req.body.state || null;
  let jwt_user = req.header("x-auth-token");
  console.log("/callback");

  let client_id = config.get("spotify_client_id");
  let client_secret = config.get("spotify_client_secret");

  if (state === null) {
    res.send(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    let authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, async function (error, response, body) {
      if (!error && response.statusCode === 200) {
        let { access_token } = body;
        let { refresh_token } = body;

        let user = await User.findByIdAndUpdate(req.user._id, {
          spotify_auth_token: {
            timeCreated: Date.now(),
            token: access_token,
          },
          spotify_refresh_token: refresh_token,
        });

        res.send(true);
        console.log("Completed auth.");
      }
    });
  }
});

// Function to help generate "state" parameter for Spotify auth process
const generateRandomString = function (length) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

module.exports = router;
