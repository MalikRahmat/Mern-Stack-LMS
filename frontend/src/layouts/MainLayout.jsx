import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export const MainLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main className="flex-grow-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
