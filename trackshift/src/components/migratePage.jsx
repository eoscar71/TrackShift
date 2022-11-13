import React, { Component } from "react";
import PlaylistList from "./common/playlistList";
import * as Spotify from "../services/spotifyService";
import * as appleMusic from "../fakeAppleMusicService";

class MigratePage extends Component {
  state = {
    fromPlaylists: {
      platform: null,
      playlists: [],
    },
    toPlaylists: {
      platform: null,
      playlists: [],
    },
    selectedPlaylists: [],
    selectedPlatforms: []
  };

  handlePlatformSelect = async (selection, listType) => {
    let playlists = {};
    let selectedPlatforms = [...this.state.selectedPlatforms];

    if (selection === "spotify")
    {
      playlists.platform = "spotify";
      if (localStorage.getItem("hasSpotifyAuth") === "false")
        await Spotify.authenticateUser();

      playlists.playlists = await Spotify.getPlaylists();
      selectedPlatforms.push(selection);
      console.log('Playlists fetched.');
    }
    else if (selection === "appleMusic")
    {
      console.log("Apple Music selected");
      selectedPlatforms.push(selection);
    }

    if (listType === "migrateFrom")
      this.setState({ fromPlaylists: playlists, selectedPlatforms });
    else if (listType === "migrateTo")
      this.setState({ toPlaylists: playlists, selectedPlatforms });
  };

  handlePlaylistSelect = (playlist) => {
    let playlists = [...this.state.selectedPlaylists];

    if (playlists.find((p) => p.name === playlist.name))
      playlists = playlists.filter((p) => p.name !== playlist.name);
    else playlists.push(playlist);

    this.setState({ selectedPlaylists: playlists });
  };

  render() {
    const { fromPlaylists, toPlaylists, selectedPlaylists, selectedPlatforms } = this.state;
    const enableMigrateButton =
      fromPlaylists.platform !== null &&
      toPlaylists.platform !== null &&
      selectedPlaylists.length > 0;
    return (
      <div className="migratePage">
        <PlaylistList
          listType="migrateFrom"
          playlists={this.state.fromPlaylists}
          selectedPlatforms = {selectedPlatforms}
          onPlatformSelect={this.handlePlatformSelect}
          onPlaylistSelect={this.handlePlaylistSelect}
        />
        <button
          className={
            enableMigrateButton
              ? "btn btn-migrate btn-primary"
              : "btn btn-migrate btn-primary disabled"
          }
        >
          Migrate playlists
        </button>
        <PlaylistList
          listType="migrateTo"
          playlists={this.state.toPlaylists}
          selectedPlatforms = {selectedPlatforms}
          onPlatformSelect={this.handlePlatformSelect}
          onPlaylistSelect={this.handlePlaylistSelect}
        />
      </div>
    );
  }
}

export default MigratePage;
