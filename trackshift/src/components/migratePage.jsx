import React, { Component } from "react";
import PlaylistList from "./common/playlistList";
import * as spotify from "../fakeSpotifyService";
import * as appleMusic from "../fakeAppleMusicService";

class MigratePage extends Component {
  state = {
    fromPlaylists: [],
    toPlaylists: [],
    selectedPlaylists: [],
  };

  handlePlatformSelect = (selection, listType) => {
    let playlists;

    if (selection === "spotify") playlists = spotify.getPlaylists();
    else if (selection === "appleMusic")
      playlists = appleMusic.getAMPlaylists();

    if (listType === "migrateFrom") this.setState({ fromPlaylists: playlists });
    else if (listType === "migrateTo")
      this.setState({ toPlaylists: playlists });
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
