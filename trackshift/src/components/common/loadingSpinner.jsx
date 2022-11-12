import React from "react";

const LoadingSpinner = (props) => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center loading">
      <div className="d-flex">
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
