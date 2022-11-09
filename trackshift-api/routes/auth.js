const express = require('express');
const request = require('request');
const config = require('config');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const querystring = require('querystring');
const {User, validate} = require('../models/user');
const router = express.Router();

let userJwt = 'user';
const generateRandomString = function(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};


router.post('/users', async (req, res) => {
    const {error} = validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);

    const user = await User.findOne({email: req.body.email});
    if(!user)
        return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword)
        return res.status(400).send('Invalid email or password.');
        
    res.send(user.generateAuthToken());
});

router.get("/spotify", (req, res) => {
    let state = generateRandomString(16);
    let scope = "user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public";
    // for client-side authentication process...
    const token = req.query.jwt;
    const redirect_uri = "http://localhost:3000/auth-redirect";
    // const token = req.headers('x-auth-token');
    // const redirect_uri = 'http://localhost:3000/api/auth/spotify/callback'
    res.cookie(userJwt, token);

    res.redirect(
        "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
            response_type: "code",
            client_id: config.get('spotify_client_id'),
            scope: scope,
            redirect_uri: redirect_uri,
            state: state,
        }) 
        );
    });
    
    router.post("/spotify/callback", (req, res) => {
      const redirect_uri = "http://localhost:3000/auth-redirect";
    // const redirect_uri = 'http://localhost:3000/api/auth/spotify/callback'
    //   console.log(req.body);
      let code = req.body.code || null;
      let state = req.body.state || null;
      let jwt_user = req.header('x-auth-token');
    //   console.log(jwt_user);
      //let jwt_user = req.cookies ? req.cookies[userJwt] : null;

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

                let access_token = body.access_token;
                let refresh_token = body.refresh_token;

                const decodedJwt = jwt.verify(jwt_user, config.get("jwtPrivateKey"));
          
                let user = await User.findByIdAndUpdate(decodedJwt._id, {
                  spotify_auth_token: {
                    timeCreated: Date.now(),
                    token: access_token
                  },
                  spotify_refresh_token: refresh_token
                });
                
              res.send(true);
              console.log('Completed auth.');
          }
        });
      }    
    });

module.exports = router;