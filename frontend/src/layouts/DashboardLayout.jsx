import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

export const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* Top Universal Navbar */}
      <Navbar />

      {/* Main Container Wrapper: Dynamic row for Mobile and Desktop layouts */}
      <div className="container-fluid flex-grow-1 p-0">
        <div className="d-flex flex-column flex-md-row">
          
          {/* SIDEBAR PANEL:
            - Desktop: Fixed exact width (270px) so long items like 'Manage Enrollments' NEVER wrap.
            - Desktop Collapsed: Shrinks nicely to 80px.
            - Mobile/Tablet: Width automatically becomes 100% and stacks beautifully.
          */}
          <aside
            className="bg-dark border-end border-secondary text-white transition-all flex-shrink-0"
            style={{
              width: '100%', // Default for mobile view
              transition: 'all 0.3s ease',
            }}
          >
            <style>{`
              /* Mobile & Tablet Styles (Below 768px) */
              @media (max-width: 767.98px) {
                /* Targetting toggle buttons inside sidebar by standard tags/icons and hiding them */
                aside button, 
                aside .btn,
                aside [class*="bi-list"], 
                aside [class*="toggle"] {
                  display: none !important;
                }
              }
            {/* Custom media queries injected locally to guarantee precise premium layout widths */}
            
              @media (min-width: 768px) {
                aside {
                  width: ${collapsed ? '80px' : '270px'} !important;
                  min-width: ${collapsed ? '80px' : '270px'} !important;
                  min-height: calc(100vh - 56px) !important;
                }
              }
            `}</style>
            
            <Sidebar
              collapsed={collapsed}
              setCollapsed={setCollapsed}
            />
          </aside>

          
          <main
            className="bg-light py-4 px-3 px-md-4 flex-grow-1"
            style={{
              minHeight: 'calc(100vh - 56px)',
              overflowX: 'hidden'
            }}
          >
            {children}
          </main>

        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;