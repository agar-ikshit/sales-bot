import React from 'react';
import './loading.css';

const LoadingMessage = () => {
  return (
    <div className="message bot loading">
      <span className="dot"></span>
      <span className="dot"></span>
      <span className="dot"></span>
    </div>
  );
};

export default LoadingMessage;
