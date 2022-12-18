const express = require("express");
const config = require("config");
const userAuth = require("../middleware/userAuth");
const youtubeAuth = require("../middleware/youtubeAuth");
const { google } = require("googleapis");
const youtube = google.youtube("v3");

const router = express.Router();
const oauth2Client = new google.auth.OAuth2(
  config.get("youtube_client_id"),
  config.get("youtube_client_secret"),
  "http://localhost:3000/auth-redirect"
);

// Get user's YouTube playlists
router.get("/playlists", [userAuth, youtubeAuth], async (req, res) => {
  google.options({ auth: oauth2Client });
  oauth2Client.setCredentials({
    access_token: req.user.youtube_auth_token.token,
    refresh_token: req.user.youtube_auth_token.refreshToken,
  });

  let playlists;
  try {
    playlists = await youtube.playlists.list({
      part: ["snippet"],
      mine: true,
    });

    playlists = playlists.data.items.map((playlist) => {
      return { id: playlist.id, name: playlist.snippet.title };
    });

    playlists = await Promise.all(
      playlists.map(async (playlist) => {
        let tracks = await youtube.playlistItems.list({
          part: ["snippet"],
          maxResults: 100,
          playlistId: playlist.id,
        });

        tracks = tracks.data.items.map((track) => {
          return {
            trackName: track.snippet.title,
            artistName: "",
          };
        });
        playlist.tracks = tracks;
        delete playlist.id;
        return playlist;
      })
    );
  } catch (error) {
    console.log(error);
  }

  res.send(playlists);
});

// Create YouTube playlists
router.post("/playlists", [userAuth, youtubeAuth], async (req, res) => {
  google.options({ auth: oauth2Client });
  oauth2Client.setCredentials({
    access_token: req.user.youtube_auth_token.token,
    refresh_token: req.user.youtube_auth_token.refreshToken,
  });

  const playlists = req.body;
  let tracks;

  for(let playlist of playlists)
  {
    const {data: newPlaylist} = await youtube.playlists.insert({
        part: 'snippet',
        resource: {
            snippet: {
                title: playlist.name
            }
        }
    });
    tracks = await Promise.all(playlist.tracks.map(async (track) => {
        let searchQuery = track.trackName + ' ';
        searchQuery+=track.artistName;
        console.log('SEARCH QUERY: ', searchQuery);

        const {data: searchResults} = await youtube.search.list({
            part: 'snippet',
            type: 'video',
            q: searchQuery
        });
        if(searchResults.items.length>0)
        {
            const trackId = searchResults.items[0].id;
            try {
                const updatedPlaylist = await youtube.playlistItems.insert({
                    part: 'snippet',
                    resource: {
                        snippet: {
                            playlistId: newPlaylist.id,
                            resourceId: {
                                kind: trackId.kind,
                                videoId: trackId.videoId
                            }
                        }
                    }
                });
            } catch (error) {
                res.send(error);
            }
        }
    }));
  }
  res.send(true);
});

module.exports = router;
