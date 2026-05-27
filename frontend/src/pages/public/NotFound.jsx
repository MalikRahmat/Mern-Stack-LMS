import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';

export const NotFound = () => {
  return (
    <MainLayout>
      <div className="container py-5 text-center my-5">
        <div className="mb-4">
          <i className="bi bi-question-circle text-danger" style={{ fontSize: '5rem' }}></i>
        </div>
        <h1 className="display-4 fw-extrabold text-dark">404 — Resource Offline</h1>
        <p className="text-muted leading">The page or academic resource you requested does not exist or has been relocated.</p>
        <Link to="/" className="btn btn-primary mt-4">Return Home</Link>
      </div>
    </MainLayout>
  );
};

export default NotFound;
