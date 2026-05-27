import React from 'react';

export const Loader = ({ message = 'Loading content...' }) => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-5 my-5">
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted fw-bold small text-uppercase tracking-wider">{message}</p>
    </div>
  );
};

export default Loader;
