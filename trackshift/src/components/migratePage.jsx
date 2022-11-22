import React, { Component } from "react";
import PlaylistList from "./common/playlistList";
import * as Spotify from "../services/spotifyService";
import * as Youtube from "../services/youtubeService";
import * as Deezer from "../services/deezerService";

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
    selectedPlatforms: [],
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
      console.log("Playlists fetched.");
    }
    else if (selection === "appleMusic")
    {
      console.log("Apple Music selected");
      selectedPlatforms.push(selection);
    }
    else if (selection === "youtubeMusic")
    {
      console.log("YouTube Music selected");
      playlists.platform = "youtubeMusic";
      if (localStorage.getItem("hasYoutubeAuth") === "false")
        await Youtube.authenticateUser();

      playlists.playlists = await Youtube.getPlaylists();
      selectedPlatforms.push(selection);
    }
    else if(selection === 'deezer')
    {
      playlists.platform = 'deezer';
      if(localStorage.getItem("hasDeezerAuth") === 'false')
        await Deezer.authenticateUser();

      playlists.playlists = await Spotify.getPlaylists();
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

  handlePlaylistMigrate = async () => {
    let playlists = [...this.state.selectedPlaylists];
    const { toPlaylists } = this.state;

    if (toPlaylists.platform === "spotify") {
      await Spotify.createPlaylists(playlists);
      toPlaylists.playlists = await Spotify.getPlaylists();
    }
    this.setState({ toPlaylists });
  };

  render() {
    const { fromPlaylists, toPlaylists, selectedPlaylists, selectedPlatforms } =
      this.state;
    console.log(selectedPlaylists);
    const enableMigrateButton =
      fromPlaylists.platform !== null &&
      toPlaylists.platform !== null &&
      selectedPlaylists.length > 0;
    return (
      <div className="migratePage">
        <PlaylistList
          listType="migrateFrom"
          playlists={this.state.fromPlaylists}
          selectedPlatforms={selectedPlatforms}
          onPlatformSelect={this.handlePlatformSelect}
          onPlaylistSelect={this.handlePlaylistSelect}
        />
        <button
          onClick={this.handlePlaylistMigrate}
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
          selectedPlatforms={selectedPlatforms}
          onPlatformSelect={this.handlePlatformSelect}
          onPlaylistSelect={this.handlePlaylistSelect}
        />
      </div>
    );
  }
}

export default MigratePage;
