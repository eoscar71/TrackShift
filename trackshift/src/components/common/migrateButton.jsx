import React, {useCallback, useState} from 'react';
import MigrationLoadingSpinner from './migrationLoadingSpinner';

const MigrateButton = ({enableMigrateButton, onPlaylistMigrate}) => {
    const [loading, setLoading] = useState(false);
    const migratePlaylists = useCallback(() => {
        setLoading(true);
        return onPlaylistMigrate().then((result) => {
          setLoading(false);
        });
      }, [onPlaylistMigrate]);
    return (
        <React.Fragment>
            {loading && <MigrationLoadingSpinner/>}
            <button
              onClick={() => migratePlaylists()}
              className={
                enableMigrateButton
                  ? "btn btn-migrate btn-primary"
                  : "btn btn-migrate btn-primary disabled"
              }
            >
              Migrate playlists
            </button>
        </React.Fragment>
     );
}
 
export default MigrateButton;