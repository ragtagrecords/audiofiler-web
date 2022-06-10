import React from 'react';
import loadingGif from 'Assets/loading-spinner.gif';
import './LoadingSpinner.scss';

const LoadingSpinner = () => {
  return (
    <img className="loadingSpinner" src={loadingGif} alt="loading" />
  );
};

export default LoadingSpinner;
