const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const _ = require('lodash');
const userAuth = require('../middleware/userAuth');
const spotifyAuth = require('../middleware/spotifyAuth');

const router = express.Router();

// Get user's Spotify playlists
router.get('/playlists', [userAuth, spotifyAuth], async (req, res) => {
    const userToken = req.user.spotify_auth_token.token;
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(userToken);

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

// Create Spotify playlists
router.post('/playlists', [userAuth, spotifyAuth], async (req, res) => {
    const userToken = req.user.spotify_auth_token.token;
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(userToken);

    let createdPlaylists = [];
    const playlists = req.body;
    let tracks;
    for(let playlist of playlists)
    {
        try {
        tracks = await Promise.all(playlist.tracks.map(async (t) => {
            let searchQuery = 'track:' + t.trackName;
            if(t.artistName!=='')
                searchQuery+=` artist:${t.artistName}`;
            const {body : searchResults} = await spotifyApi.searchTracks(searchQuery);
            const {tracks : track} = searchResults;
            
            if(track.items.length>0 && track.items[0].id)
                return "spotify:track:" + track.items[0].id;
            else
                return null;
        }));

        tracks = tracks.filter((t) => t!==null);

        const { body } = await spotifyApi.createPlaylist(playlist.name);
        let createdPlaylist = await spotifyApi.addTracksToPlaylist(body.id, tracks);
        createdPlaylists.push(createdPlaylist);
        }
        catch(error) {
            console.log(error);
        }

    }
    res.send(true);
});

module.exports = router;