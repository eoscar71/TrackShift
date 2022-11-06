import React, { Component } from "react";
import axios from 'axios';
import querystring from 'querystring';
import PlaylistList from "./common/playlistList";
import * as spotify from "../fakeSpotifyService";
import * as appleMusic from "../fakeAppleMusicService";

axios.defaults.headers.common["x-auth-token"] = localStorage.getItem('token');
class MigratePage extends Component {
  state = {
    fromPlaylists: [],
    toPlaylists: [],
    selectedPlaylists: [],
  };

  componentDidMount() {
  }

  handlePlatformSelect = async (selection, listType) => {
    let playlists;

    if (selection === "spotify") {
      const jwt = localStorage.getItem('token');
      window.location='http://localhost:3900/api/auth/spotify?' +
         querystring.stringify({jwt: jwt});
      console.log('Welcome back!');
      
      playlists = spotify.getPlaylists();
    }
    else if (selection === "appleMusic")
      playlists = appleMusic.getAMPlaylists();

    if (listType === "migrateFrom") this.setState({ fromPlaylists: playlists });
    else if (listType === "migrateTo")
      this.setState({ toPlaylists: playlists });
  };

  getPlaylists = async (code, state) => {
    const playlists = await axios.post('http://localhost:3900/api/auth/spotify/callback', {
      code: code,
      state: state
    });
    console.log(playlists);
  };

  handlePlaylistSelect = (playlist) => {
    let playlists = [...this.state.selectedPlaylists];

    if (playlists.find((p) => p.playlistName === playlist.playlistName))
      playlists = playlists.filter(
        (p) => p.playlistName !== playlist.playlistName
      );
    else playlists.push(playlist);

    this.setState({ selectedPlaylists: playlists });
  };

  render() {
    if(this.props.urlParams.get("state") && this.props.urlParams.get('code'))
    {
      this.getPlaylists(this.props.urlParams.get('code'), this.props.urlParams.get('state'));
    }

    console.log(this.state.selectedPlaylists);
    return (
      <div className="migratePage">
        <PlaylistList
          listType="migrateFrom"
          playlists={this.state.fromPlaylists}
          onPlatformSelect={this.handlePlatformSelect}
          onPlaylistSelect={this.handlePlaylistSelect}
        />
        <button className="btn btn-migrate btn-primary">
          Migrate playlists
        </button>
        <PlaylistList
          listType="migrateTo"
          playlists={this.state.toPlaylists}
          onPlatformSelect={this.handlePlatformSelect}
          onPlaylistSelect={this.handlePlaylistSelect}
        />
      </div>
    );
  }
}

export default MigratePage;
