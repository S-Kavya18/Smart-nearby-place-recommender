import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-text">Finding perfect places for you...</p>
    </div>
  );
};

export default LoadingSpinner;
