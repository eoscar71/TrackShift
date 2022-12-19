import React, {useCallback, useState} from 'react';
import LoadingSpinner from './loadingSpinner';
import spotify_icon from "../../icons/spotify_icon.svg";
import youtubeMusic_icon from "../../icons/youtubeMusic_icon.svg";
import deezer_icon from "../../icons/deezer_icon.svg";

const PlatformSelect = ({onPlatformSelect, listType, selectedPlatforms}) => {
    const [loading, setLoading] = useState(false);
    const getPlaylists = useCallback((selection, listType) => {
        setLoading(true);
        return onPlatformSelect(selection, listType).then((result) => {
          setLoading(false);
        });
      }, [onPlatformSelect]);
    return (
        <React.Fragment>
           {!loading && <div>
                <p className="text-center mt-5">
                    Connect the account you want to migrate your playlists{" "}
                    {listType === "migrateFrom" ? "from" : "to"}:
                  </p>
                  <div className="d-flex justify-content-center">
                    {!selectedPlatforms.find((p) => p==='Spotify') && <img
                      className="clickableImg"
                      onClick={() => getPlaylists('Spotify', listType)}
                      src={spotify_icon}
                      alt=""
                    />}
                    {!selectedPlatforms.find((p) => p==='YouTube Music') && <img
                      className="clickableImg"
                      onClick={() => getPlaylists('YouTube Music', listType)}
                      src={youtubeMusic_icon}
                      alt=""
                    />}
                    {!selectedPlatforms.find((p) => p==='Deezer') && <img
                      className="clickableImg"
                      onClick={() => getPlaylists('Deezer', listType)}
                      src={deezer_icon}
                      alt=""
                    />}
                  </div>
            </div>}
            {loading && <LoadingSpinner/>}
        </React.Fragment>
    );
}
 
export default PlatformSelect;