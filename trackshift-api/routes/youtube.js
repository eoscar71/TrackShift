const express = require("express");
const config = require('config');
const userAuth = require("../middleware/userAuth");
const youtubeAuth = require("../middleware/youtubeAuth");
const { google } = require("googleapis");
const youtube = google.youtube('v3');

const router = express.Router();
const oauth2Client = new google.auth.OAuth2(
    config.get('youtube_client_id'),
    config.get('youtube_client_secret'),
    'http://localhost:3000/auth-redirect'
  );
  
  router.get("/playlists", [userAuth, youtubeAuth], async (req, res) => {
    google.options({auth: oauth2Client});
    oauth2Client.setCredentials({
        access_token: req.user.youtube_auth_token.token,
        refresh_token: req.user.youtube_auth_token.refreshToken
    });

    let playlists;
    try {
        playlists = await youtube.playlists.list({
            part: ['snippet'],
            mine: true
        });

        playlists = playlists.data.items.map((playlist) => {
            return {id: playlist.id, name: playlist.snippet.title};
        });

        playlists = await Promise.all(playlists.map(async (playlist) => {
            let tracks = await youtube.playlistItems.list({
                part: ['snippet'],
                playlistId: playlist.id
            });

            tracks = tracks.data.items.map((track) => {
                return {
                    trackName: track.snippet.title,
                    artistName: ''
                };
            });
            playlist.tracks = tracks;
            delete playlist.id;
            return playlist;
        }));

    } catch (error) {
        console.log(error);
    }

    res.send(playlists);
});

module.exports = router;