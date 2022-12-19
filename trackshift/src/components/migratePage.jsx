import React, { Component } from "react";
import PlaylistList from "./common/playlistList";
import * as Spotify from "../services/spotifyService";
import * as Youtube from "../services/youtubeService";
import * as Deezer from "../services/deezerService";
import MigrateButton from "./common/migrateButton";

class MigratePage extends Component {
  state = {
    fromPlaylists: {
      platform: "",
      playlists: [],
    },
    toPlaylists: {
      platform: "",
      playlists: [],
    },
    selectedPlaylists: [],
    selectedPlatforms: [],
  };

  handlePlatformSelect = async (selection, listType) => {
    let playlists = {};
    let selectedPlatforms = [...this.state.selectedPlatforms];

    if (selection === "Spotify")
    {
      playlists.platform = "Spotify";
      if (localStorage.getItem("hasSpotifyAuth") === "false")
        await Spotify.authenticateUser();

      playlists.playlists = await Spotify.getPlaylists();
      selectedPlatforms.push(selection);
      console.log("Playlists fetched.");

    }
    else if (selection === "YouTube Music")
    {
      console.log("YouTube Music selected");
      playlists.platform = "YouTube Music";
      if (localStorage.getItem("hasYoutubeAuth") === "false")
        await Youtube.authenticateUser();

      playlists.playlists = await Youtube.getPlaylists();
      selectedPlatforms.push(selection);
    }
    else if(selection === 'Deezer')
    {
      playlists.platform = 'Deezer';
      if(localStorage.getItem("hasDeezerAuth") === 'false')
        await Deezer.authenticateUser();

      playlists.playlists = await Deezer.getPlaylists();
      selectedPlatforms.push(selection);
    }

    if (listType === "migrateFrom")
      this.setState({ fromPlaylists: playlists, selectedPlatforms });
    else if (listType === "migrateTo")
      this.setState({ toPlaylists: playlists, selectedPlatforms });
  };

  handlePlatformDeselect = (listType, platform) => {
    const playlists = {
      platform: "",
      playlists: []
    };

    let {selectedPlatforms} = this.state;
    selectedPlatforms = selectedPlatforms.filter((p) => p!==platform);

    if(listType==='migrateFrom')
      this.setState({fromPlaylists: playlists, selectedPlatforms, selectedPlaylists: []});
    else if(listType==='migrateTo')
      this.setState({toPlaylists: playlists, selectedPlatforms});
  };

  handlePlaylistSelect = (playlist) => {
    let playlists = [...this.state.selectedPlaylists];

    if (playlists.find((p) => p.name === playlist.name))
      playlists = playlists.filter((p) => p.name !== playlist.name);
    else
      playlists.push(playlist);

    this.setState({ selectedPlaylists: playlists });
  };

  handlePlaylistMigrate = async () => {
    let playlists = [...this.state.selectedPlaylists];
    const { toPlaylists } = this.state;

    if (toPlaylists.platform === "Spotify") {
      await Spotify.createPlaylists(playlists);
      toPlaylists.playlists = await Spotify.getPlaylists();
    }
    else if (toPlaylists.platform === "Deezer") {
      await Deezer.createPlaylists(playlists);
      toPlaylists.playlists = await Deezer.getPlaylists();
    }
    else if (toPlaylists.platform === "YouTube Music") {
      await Youtube.createPlaylists(playlists);
      toPlaylists.playlists = await Youtube.getPlaylists();
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
          onPlatformDeselect={this.handlePlatformDeselect}
          onPlaylistSelect={this.handlePlaylistSelect}
        />
        <MigrateButton
          enableMigrateButton={enableMigrateButton}
          onPlaylistMigrate={this.handlePlaylistMigrate}
        />
        <PlaylistList
          listType="migrateTo"
          playlists={this.state.toPlaylists}
          selectedPlatforms={selectedPlatforms}
          onPlatformSelect={this.handlePlatformSelect}
          onPlatformDeselect={this.handlePlatformDeselect}
          onPlaylistSelect={this.handlePlaylistSelect}
        />
      </div>
    );
  }
}

export default MigratePage;
