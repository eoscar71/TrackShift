const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const {User} = require('../models/user');
const jwt = require("jsonwebtoken");
const Joi = require('joi');
const _ = require('lodash');
const config = require('config');

const router = express.Router();

router.get('/playlists', async (req, res) => {
    const userJwt = req.header('x-auth-token');
    const decodedJwt = jwt.verify(userJwt, config.get('jwtPrivateKey'));

    let user = await User.findById(decodedJwt._id);

    const spotifyApi = new SpotifyWebApi();

    const timeElapsed = (Date.now() - user.spotify_auth_token.timeCreated) / 1000;
    console.log('time elapsed: ', timeElapsed);
    if(timeElapsed >= 3300)
        user = await refreshAccessToken(user);

    spotifyApi.setAccessToken(user.spotify_auth_token.token);

    const {body : spotifyUserInfo} = await spotifyApi.getMe();
    const spotifyUserId = _.pick(spotifyUserInfo, ['id']);

    let {body : userPlaylistData} = await spotifyApi.getUserPlaylists(spotifyUserId);
    
    const playlists = await Promise.all(userPlaylistData.items.map(async (p) => {
        const {body : trackData} = await spotifyApi.getPlaylistTracks(p.id);
        
        const tracks = trackData.items.map((t) => {
            trackItems = {
                trackName: t.track.name,
                artistName: t.track.artists[0].name,
                duration: t.track.duration_ms
            };
            return trackItems;
        });
        
        const playlist = {
            id: p.id,
            name: p.name,
            images: p.images,
            tracks: tracks
        };
        return playlist;
    }));

    res.send(playlists);
});

router.post('/playlists', async (req, res) => {
    const userJwt = req.header('x-auth-token');
    const decodedJwt = jwt.verify(userJwt, config.get('jwtPrivateKey'));

    let user = await User.findById(decodedJwt._id);

    const spotifyApi = new SpotifyWebApi();

    const timeElapsed = (Date.now() - user.spotify_auth_token.timeCreated) / 1000;
    console.log('time elapsed: ', timeElapsed);
    if(timeElapsed >= 3300)
        user = await refreshAccessToken(user);

    spotifyApi.setAccessToken(user.spotify_auth_token.token);

    const playlists = req.body;
    let tracks;
    for(let playlist of playlists)
    {
        tracks = await Promise.all(playlist.tracks.map(async (t) => {
            const {body : searchResults} = await spotifyApi.searchTracks(`track:${t.trackName} artist:${t.artistName}`);
            const {tracks : track} = searchResults;
            
            let trackID = "spotify:track:" + track.items[0].id;
            return trackID;
        }));

        const { body } = await spotifyApi.createPlaylist(playlist.name);
        let createdPlaylist = await spotifyApi.addTracksToPlaylist(body.id, tracks);
        console.log(createdPlaylist);
    }
    res.send(tracks);
});

async function refreshAccessToken(user) {
    const spotifyApi = new SpotifyWebApi({
        clientId: config.get('spotify_client_id'),
        clientSecret: config.get('spotify_client_secret'),
        refreshToken: user.spotify_refresh_token,
    });
    const {body} = await spotifyApi.refreshAccessToken();
    const updatedUser = await User.findByIdAndUpdate(user._id, {
        spotify_auth_token: {
            timeCreated: Date.now(),
            token: body.access_token
        }
    },
    {new: true});
    console.log('ACCESS TOKEN REFRESHED.');
    return updatedUser;
}

module.exports = router;