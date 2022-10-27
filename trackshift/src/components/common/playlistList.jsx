import React, { Component } from "react";
import spotify_icon from "../../icons/spotify_icon.svg";
import appleMusic_icon from "../../icons/appleMusic_icon.svg";

class PlaylistList extends Component {
  state = {
    showTracks: [],
  };

  handleShowTracks = (playlist) => {
    let tracks = [...this.state.showTracks];

    if (tracks.find((p) => p === playlist.playlistName))
      tracks = tracks.filter((p) => p !== playlist.playlistName);
    else tracks.push(playlist.playlistName);

    this.setState({ showTracks: tracks });
  };

  renderPlatformSelect() {
    const { onPlatformSelect, listType } = this.props;
    return (
      <React.Fragment>
        <p className="text-center mt-5">
          Connect the account you want to migrate your playlists{" "}
          {listType === "migrateFrom" ? "from" : "to"}:
        </p>
        <div className="d-flex justify-content-center">
          <img
            className="clickableImg"
            onClick={() => onPlatformSelect("spotify", listType)}
            src={spotify_icon}
            alt=""
          />
          <img
            className="clickableImg"
            onClick={() => onPlatformSelect("appleMusic", listType)}
            src={appleMusic_icon}
            alt=""
          />
        </div>
      </React.Fragment>
    );
  }

  renderTracklist(tracks) {
    return tracks.map((track) => {
      return (
        <div className="list-group-item d-flex">
          <ul>
            <li>{track.title}</li>
          </ul>
        </div>
      );
    });
  }

  renderPlaylists() {
    const { playlists, onPlaylistSelect } = this.props;
    const { showTracks } = this.state;
    console.log(showTracks);
    return (
      <div className="list-group border-bottom rounded-0 rounded-bottom scrollarea">
        {playlists.map((playlist) => {
          const tracklistRender = showTracks.find(
            (p) => p === playlist.playlistName
          );

          const checkboxRender = this.props.listType === "migrateFrom";
          return (
            <React.Fragment key={playlist.playlistName}>
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
                        {playlist.playlistName}
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
    const { playlists } = this.props;
    return (
      <span className="playlistList border rounded d-inline-flex flex-column align-items-stretch flex-shrink-0 bg-white">
        <a
          href="/"
          className="listHeader d-flex flex-shrink-0 p-3 link-dark text-decoration-none rounded-top border-bottom"
        >
          <span className="fs-5 fw-semibold">List group</span>
        </a>
        {playlists.length === 0
          ? this.renderPlatformSelect()
          : this.renderPlaylists()}
      </span>
    );
  }
}

export default PlaylistList;
