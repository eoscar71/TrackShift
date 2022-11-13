import React, {useCallback, useState} from 'react';
import LoadingSpinner from './loadingSpinner';
import spotify_icon from "../../icons/spotify_icon.svg";
import appleMusic_icon from "../../icons/appleMusic_icon.svg";

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
                    {!selectedPlatforms.find((p) => p==='spotify') && <img
                      className="clickableImg"
                      onClick={() => getPlaylists('spotify', listType)}
                      src={spotify_icon}
                      alt=""
                    />}
                    {!selectedPlatforms.find((p) => p==='appleMusic') && <img
                      className="clickableImg"
                      onClick={() => getPlaylists('appleMusic', listType)}
                      src={appleMusic_icon}
                      alt=""
                    />}
                  </div>
            </div>}
            {loading && <LoadingSpinner/>}
        </React.Fragment>
    );
}
 
export default PlatformSelect;