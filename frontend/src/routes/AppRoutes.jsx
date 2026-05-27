import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import RoleRoute from '../components/common/RoleRoute';

// =========================
// Public Pages
// =========================
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Courses from '../pages/public/Courses';
import CourseDetailsPage from '../pages/public/CourseDetailsPage';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import ForgotPassword from '../pages/public/ForgotPassword';
import ResetPassword from '../pages/public/ResetPassword';
import NotFound from '../pages/public/NotFound';

// =========================
// Student Pages
// =========================
import StudentDashboard from '../pages/student/StudentDashboard';
import MyCourses from '../pages/student/MyCourses';
import StudentProfile from '../pages/student/StudentProfile';

// =========================
// Instructor Pages
// =========================
import InstructorDashboard from '../pages/instructor/InstructorDashboard';
import ManageCourses from '../pages/instructor/ManageCourses';
import EditCourse from '../pages/instructor/EditCourse';
import CreateCourse from '../pages/instructor/CreateCourse';
import UploadLessons from '../pages/instructor/UploadLessons';

// =========================
// Admin Pages
// =========================
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageCoursesAdmin from '../pages/admin/ManageCourses';
import ReportsAnalytics from '../pages/admin/ReportsAnalytics';
import ManageEnrollments from '../pages/admin/ManageEnrollments';

export const AppRoutes = () => {
  return (
    <Routes>

      {/* =========================
          Public Routes
      ========================= */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/course-overview/:id" element={<CourseDetailsPage />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* =========================
          Protected Course Learning Route
      ========================= */}
      <Route
        path="/courses/:id"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['student', 'admin', 'instructor']}>
              <CourseDetailsPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* =========================
          Student Routes
      ========================= */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['student']}>
              <StudentDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/my-courses"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['student']}>
              <MyCourses />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/profile"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['student']}>
              <StudentProfile />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* =========================
          Instructor Routes
      ========================= */}
      <Route
        path="/instructor/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['instructor']}>
              <InstructorDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/courses"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['instructor']}>
              <ManageCourses />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/courses/edit/:id"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['instructor']}>
              <EditCourse />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/create-course"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['instructor']}>
              <CreateCourse />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/upload-lessons"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['instructor']}>
              <UploadLessons />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* =========================
          Admin Routes
      ========================= */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['admin']}>
              <ManageUsers />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['admin']}>
              <ManageCoursesAdmin />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['admin']}>
              <ReportsAnalytics />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/enrollments"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['admin']}>
              <ManageEnrollments />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* =========================
          Fallback Routes (404)
      ========================= */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />

    </Routes>
  );
};

export default AppRoutes;