import React from 'react';
import { useAuth } from '../../hooks/useAuth';

import StudentSidebar from '../dashboard/StudentSidebar';
import InstructorSidebar from '../dashboard/InstructorSidebar';
import AdminSidebar from '../dashboard/AdminSidebar';

export const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user } = useAuth();

  // If user state is fetching or unauthenticated, render nothing safely
  if (!user) return null;

  // Render role-based sidebars dynamically while cascading state management props
  switch (user.role) {
    case 'admin':
      return (
        <AdminSidebar
          user={user}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      );

    case 'instructor':
      return (
        <InstructorSidebar
          user={user}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      );

    case 'student':
      return (
        <StudentSidebar
          user={user}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      );

    default:
      return null;
  }
};

export default Sidebar;