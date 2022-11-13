import React, { Component } from "react";
import PlatformSelect from "./platformSelect";

class PlaylistList extends Component {
  state = {
    showTracks: [],
  };

  handleShowTracks = (playlist) => {
    let tracks = [...this.state.showTracks];

    if (tracks.find((p) => p === playlist.name))
      tracks = tracks.filter((p) => p !== playlist.name);
    else tracks.push(playlist.name);

    this.setState({ showTracks: tracks });
  };

  renderTracklist(tracks) {
    return tracks.map((track) => {
      return (
        <div className="list-group-item d-flex">
          <ul className="tracklist-item">
            <li>
              {track.trackName}
              <small className="d-block text-muted">{track.artistName}</small>
            </li>
          </ul>
        </div>
      );
    });
  }

  renderPlaylists() {
    const { playlists: playlistObject, onPlaylistSelect } = this.props;
    const { showTracks } = this.state;
    const { playlists } = playlistObject;
    return (
      <div className="list-group border-bottom rounded-0 rounded-bottom scrollarea">
        {playlists.map((playlist) => {
          const tracklistRender = showTracks.find((p) => p === playlist.name);

          const checkboxRender = this.props.listType === "migrateFrom";
          return (
            <React.Fragment key={playlist.name}>
              <div className="list-group-item d-flex align-items-center justify-content-between">
                <div className="d-flex gap-2">
                  <span className="d-inline-block">
                    {checkboxRender ? (
                      <input
                        className="select-playlist form-check-input flex-shrink-0"
                        type="checkbox"
                        value={playlist}
                        onClick={() => onPlaylistSelect(playlist)}
                      />
                    ) : null}
                  </span>
                  <label>
                    <div>
                      <span>
                        {playlist.name}
                        <small className="d-block text-muted">
                          {playlist.tracks.length + " "}tracks
                        </small>
                      </span>
                    </div>
                  </label>
                </div>
                <div>
                  <a
                    className="show-tracks d-block text-muted"
                    onClick={() => this.handleShowTracks(playlist)}
                  >
                    {tracklistRender ? "Hide tracks" : "Show tracks"}
                  </a>
                </div>
              </div>
              {tracklistRender ? this.renderTracklist(playlist.tracks) : null}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  render() {
    const platform = this.props.playlists.platform;
    const { onPlatformSelect, listType, selectedPlatforms } = this.props;
    let listHeaderMessage = "Migrating ";

    if (listType === "migrateTo") listHeaderMessage += "to ";
    else if (listType === "migrateFrom") listHeaderMessage += "from ";

    return (
      <span className="playlistList justify-items-center d-inline-flex border rounded flex-column flex-row flex-shrink-0 bg-white">
        <div className="d-flex flex-shrink-0 p-3 link-dark text-decoration-none rounded-top border-bottom">
          <span className="fs-5 fw-semibold">{listHeaderMessage}</span>
        </div>
        {!platform ? (
          <PlatformSelect
            onPlatformSelect={onPlatformSelect}
            selectedPlatforms={selectedPlatforms}
            listType={listType}
          />
        ) : (
          this.renderPlaylists()
        )}
      </span>
    );
  }
}

export default PlaylistList;
