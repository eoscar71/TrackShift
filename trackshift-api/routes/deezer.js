const querystring = require('querystring');
const express = require('express');
const userAuth = require('../middleware/userAuth');
const deezerAuth = require('../middleware/deezerAuth');
const request = require("request");

const router = express.Router();

router.get('/playlists', [userAuth, deezerAuth], async (req, res) => {
    
    let {data: userPlaylists} = await new Promise((resolve, reject) => {
        const url = 'https://api.deezer.com/user/me/playlists?' +
        querystring.stringify({
            access_token: req.user.deezer_auth_token
        });
        request.get(url, async function(error, response, body) {
            resolve(JSON.parse(body));
        });
    });

    userPlaylists = await Promise.all(userPlaylists.map(async (p) =>  {
        let playlist = {
            name: p.title,
        };

        const tracks = await new Promise((resolve, reject) => {
            const url = p.tracklist + '?' +
                querystring.stringify({
                    access_token: req.user.deezer_auth_token
                });
            request.get(url, async function(error, response, body) {
                resolve(JSON.parse(body).data);
            });
        });

        playlist.tracks = tracks.map((track) => {
            return {
                trackName: track.title,
                artistName: track.artist.name
            };
        });

        return playlist;
    }));
    res.send(userPlaylists);
});

module.exports = router;