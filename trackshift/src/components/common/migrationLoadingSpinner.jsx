import React from 'react';

const MigrationLoadingSpinner = () => {
    return (
      <div className="backdrop">
        <div className="migrate-load-overlay d-flex flex-column justify-content-center align-items-center shadow animate__animated animate__fadeInDown">
          <div className="d-flex">
            <div class="lds-facebook">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div>
            <h6>TrackShifting...</h6>
          </div>
        </div>
      </div>
    );
}
 
export default MigrationLoadingSpinner;