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

    let tracks = [];
    let lastPage = false;
    let url = p.tracklist + '?' +
    querystring.stringify({
        access_token: req.user.deezer_auth_token
    }); 
    while(!lastPage)
    {
        const tracklistData = await new Promise((resolve) => {
            request.get(url, function (error, response, body) {
                resolve(JSON.parse(body));
            });
        });
        console.log(tracklistData);
        for(let i = 0; i < tracklistData.data.length; i++)
            tracks.push(tracklistData.data[i]);
        if(tracklistData.next)
        {
            url = tracklistData.next;
        }
        else
            lastPage = true;
    }
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

router.post('/playlists', [userAuth, deezerAuth], async (req, res) => {
    const playlists = req.body;

    for(playlist of playlists)
    {
        let newPlaylist = await new Promise((resolve) => {
            const url = 'https://api.deezer.com/user/me/playlists?' +
            querystring.stringify({
                access_token: req.user.deezer_auth_token,
                title: playlist.name
            });
            request.post(url, async function (error, response, body) {
                resolve(JSON.parse(body));
            });
        });

        let tracks = [];
        for(let i=0; i<playlist.tracks.length; i++)
        {
            let track = playlist.tracks[i];
            let searchQuery = '';
            if(track.artistName!=='')
                searchQuery+='artist:\"' + track.artistName + '\" ';
            searchQuery+='track:\"' + track.trackName + '\"';

            console.log('Search query: ', searchQuery);
            const url = "https://api.deezer.com/search?" +
                querystring.stringify({
                    q: searchQuery
                });
                
            const {data : searchResults} = await new Promise((resolve) => {
                request.get(url, function (error, response, body) {
                    resolve(JSON.parse(body));
                });
            });
            
            if(searchResults.length>0)
            {
                tracks.push(searchResults[0].id);
            }
        }

        const updatedPlaylist = await new Promise((resolve) => {
            let trackIdString = tracks[0] + ',';
            for(let i=1; i<tracks.length; i++)
            {
                trackIdString+=`${tracks[i]},`;
            }
            const url = `https://api.deezer.com/playlist/${newPlaylist.id}/tracks?` +
            querystring.stringify({
                access_token: req.user.deezer_auth_token, 
                songs: trackIdString
            });

            request.post(url, function (error, response, body) {
                resolve(JSON.parse(body));
            });
        });
        console.log(updatedPlaylist);
    }
    res.send('Done.');
});

module.exports = router;