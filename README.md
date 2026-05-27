# MERN Stack Learning Management System (LMS)

##  Project Overview

This project is a Full Stack Learning Management System (LMS) developed using the MERN Stack (MongoDB, Express.js, React.js, Node.js).

The system supports three user roles:

* Admin
* Instructor
* Student

The application allows instructors to create and manage courses, students to enroll and watch lessons, and admins to manage users and platform activities.

---

#  Features

##  Student Features

* User Registration & Login
* Browse Courses
* Enroll in Courses
* View Enrolled Courses
* Watch Video Lessons
* Update Profile

##  Instructor Features

* Create Courses
* Edit/Delete Courses
* Upload Lessons
* Manage Courses

##  Admin Features

* View All Users
* Delete Users
* Manage Courses
* View Analytics Dashboard

---

#  Technologies Used

## Frontend

* React JS
* React Router DOM
* Axios
* Bootstrap / React Bootstrap

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Bcrypt.js
* Dotenv

---

# LMS MERN Project - Folder Structure

```text
lms-mern-project/
│
├── README.md
├── .gitignore
│
├── backend/
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   ├── .env
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Enrollment.js
│   │   ├── Lesson.js
│   │   └── Category.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── courseController.js
│   │   ├── enrollmentController.js
│   │   ├── lessonController.js
│   │   ├── analyticsController.js
│   │   └── categoryController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── enrollmentRoutes.js
│   │   ├── lessonRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── categoryRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── notFoundMiddleware.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── hashPassword.js
│   │   ├── responseHandler.js
│   │   └── sendEmail.js
│   │
│   ├── uploads/
│   │   ├── lessons/
│   │   └── profiles/
│   │
│   └── data/
│       └── db.json
│
├── frontend/
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   │
│   ├── public/
│   │   └── index.html
│   │
│   └── src/
│       │
│       ├── index.js
│       ├── App.js
│       │
│       ├── api/
│       │   └── axios.js
│       │
│       ├── assets/
│       │   └── styles/
│       │       ├── global.css
│       │       ├── auth.css
│       │       ├── dashboard.css
│       │       └── courses.css
│       │
│       ├── components/
│       │   ├── common/
│       │   │   ├── Navbar.jsx
│       │   │   ├── Footer.jsx
│       │   │   ├── Loader.jsx
│       │   │   ├── Sidebar.jsx
│       │   │   ├── ProtectedRoute.jsx
│       │   │   └── RoleRoute.jsx
│       │   │
│       │   ├── auth/
│       │   │   ├── LoginForm.jsx
│       │   │   └── RegisterForm.jsx
│       │   │
│       │   ├── courses/
│       │   │   ├── CourseCard.jsx
│       │   │   ├── CourseList.jsx
│       │   │   ├── CourseDetails.jsx
│       │   │   ├── CourseForm.jsx
│       │   │   └── LessonUploadForm.jsx
│       │   │
│       │   ├── dashboard/
│       │   │   ├── StudentSidebar.jsx
│       │   │   ├── InstructorSidebar.jsx
│       │   │   ├── AdminSidebar.jsx
│       │   │   ├── AnalyticsCards.jsx
│       │   │   └── Charts.jsx
│       │   │
│       │   └── users/
│       │       ├── UserTable.jsx
│       │       └── ProfileCard.jsx
│       │
│       ├── context/
│       │   └── AuthContext.jsx
│       │
│       ├── hooks/
│       │   ├── useAuth.js
│       │   └── useFetch.js
│       │
│       ├── layouts/
│       │   ├── MainLayout.jsx
│       │   └── DashboardLayout.jsx
│       │
│       ├── pages/
│       │   ├── public/
│       │   │   ├── Home.jsx
│       │   │   ├── About.jsx
│       │   │   ├── Courses.jsx
│       │   │   ├── CourseDetailsPage.jsx
│       │   │   ├── Login.jsx
│       │   │   ├── Register.jsx
│       │   │   ├── NotFound.jsx
│       │   │   ├── ResetPassword.jsx
│       │   │   └── ForgotPassword.jsx
│       │   │
│       │   ├── student/
│       │   │   ├── StudentDashboard.jsx
│       │   │   ├── MyCourses.jsx
│       │   │   └── StudentProfile.jsx
│       │   │
│       │   ├── instructor/
│       │   │   ├── InstructorDashboard.jsx
│       │   │   ├── CreateCourse.jsx
│       │   │   ├── ManageCourses.jsx
│       │   │   ├── EditCourse.jsx
│       │   │   └── UploadLessons.jsx
│       │   │
│       │   └── admin/
│       │       ├── AdminDashboard.jsx
│       │       ├── ManageUsers.jsx
│       │       ├── ManageCourses.jsx
│       │       ├── ReportsAnalytics.jsx
│       │       └── ManageEnrollments.jsx
│       │
│       ├── routes/
│       │   └── AppRoutes.jsx
│       │
│       ├── services/
│       │   ├── authService.js
│       │   ├── courseService.js
│       │   ├── enrollmentService.js
│       │   ├── userService.js
│       │   ├── analyticsService.js
│       │   ├── categoryService.js
│       │   └── lessonService.js
│       │
│       └── utils/
│           ├── constants.js
│           ├── helpers.js
│           └── validators.js
│
├── screenshots/docs/
│   ├── about
│   ├── admin_dashboard
│   ├── instructor_dashboard
│   ├── student_dashboard
│   └── courses
│   └── about

```


#  Authentication & Security

* Passwords are hashed using Bcrypt
* JWT-based Authentication
* Protected Routes
* Role-Based Authorization
* Environment Variables used for sensitive data

---

# 🔌 API Endpoints

# LMS MERN Project - API Documentation

## Base URL
```
/api
```

---

# 1. AUTH ROUTES
**File:** `backend/routes/authRoutes.js`

## Endpoints

### Register User
```
POST /api/auth/register
```

### Login User
```
POST /api/auth/login
```

### Get Logged-in User Profile
```
GET /api/auth/profile
```
**Auth:** Required (JWT)

### Forgot Password
```
POST /api/auth/forgot-password
```

### Reset Password
```
POST /api/auth/reset-password/:token
```

---

# 2. ANALYTICS ROUTES
**File:** `backend/routes/analyticsRoutes.js`

## Endpoints

### Get Analytics Data
```
GET /api/analytics
```

**Auth:** Required  
**Roles Allowed:** instructor, admin

---

# 3. CATEGORY ROUTES
**File:** `backend/routes/categoryRoutes.js`

## Endpoints

### Get All Categories
```
GET /api/categories
```
**Access:** Public

### Create Category
```
POST /api/categories
```
**Auth:** Required

---

# 4. COURSE ROUTES
**File:** `backend/routes/courseRoutes.js`

## Endpoints

### Get All Courses
```
GET /api/courses
```

### Get Single Course
```
GET /api/courses/:id
```

### Get Instructor Courses
```
GET /api/courses/instructor/me
```
**Auth:** Required  
**Roles:** instructor

### Create Course
```
POST /api/courses
```
**Auth:** Required  
**Roles:** instructor, admin

### Update Course
```
PUT /api/courses/:id
```
**Auth:** Required  
**Roles:** instructor, admin

### Delete Course
```
DELETE /api/courses/:id
```
**Auth:** Required  
**Roles:** instructor, admin

---

# 5. ENROLLMENT ROUTES
**File:** `backend/routes/enrollmentRoutes.js`

## Student Routes

### Enroll in Course
```
POST /api/enrollments/enroll
```
**Auth:** Required  
**Role:** student

### Get My Courses
```
GET /api/enrollments/my-courses
```
**Auth:** Required  
**Role:** student

### Update Progress
```
PUT /api/enrollments/:id/progress
```
**Auth:** Required  
**Role:** student

---

## Admin Routes

### Get All Enrollments
```
GET /api/enrollments/admin/all
```
**Auth:** Required  
**Role:** admin

### Approve/Reject Enrollment
```
PUT /api/enrollments/admin/status/:id
```
**Auth:** Required  
**Role:** admin

### Delete Enrollment
```
DELETE /api/enrollments/admin/:id
```
**Auth:** Required  
**Role:** admin

---

# 6. LESSON ROUTES
**File:** `backend/routes/lessonRoutes.js`

## Endpoints

### Get Lessons by Course
```
GET /api/lessons/:courseId
```

### Create Lesson (Upload Video)
```
POST /api/lessons
```
**Auth:** Required  
**File Upload:** videoFile (multipart/form-data)

### Update Lesson
```
PUT /api/lessons/:id
```
**Auth:** Required  
**File Upload:** videoFile (optional)

### Delete Lesson
```
DELETE /api/lessons/:id
```
**Auth:** Required

---

# 7. USER ROUTES
**File:** `backend/routes/userRoutes.js`

## Endpoints

### Get All Users
```
GET /api/users
```
**Auth:** Required  
**Role:** admin

---

### Get User Details
```
GET /api/users/:id
```
**Auth:** Required  
**Role:** admin

---

### Delete User
```
DELETE /api/users/:id
```
**Auth:** Required  
**Role:** admin

---

### Create Instructor
```
POST /api/users/create-instructor
```
**Auth:** Required  
**Role:** admin

---

### Replace Instructor
```
POST /api/users/replace-instructor
```
**Auth:** Required  
**Role:** admin

---

### Reset User Password (Admin)
```
POST /api/users/reset-password
```
**Auth:** Required  
**Role:** admin

---

### Update User Profile
```
PUT /api/users/profile
```
**Auth:** Required  
**File Upload:** profilePicture (optional)

---

# Summary
This LMS API supports:

- Authentication (JWT)
- Role-based access (Admin / Instructor / Student)
- Course Management
- Enrollment System
- Lesson Upload (Video)
- User Management
- Analytics Dashboard
- Category System

```

# ⚙️ Installation Steps

## 1️⃣ Clone Repository

```bash
git clone https://github.com/MalikRahmat/Mern-Stack-LMS
```

---

## 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3️⃣ Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 4️⃣ Setup Environment Variables

Create `.env` file inside backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Create `.env` file inside frontend folder:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 5️⃣ Run Backend

```bash
npm run server
```

---

## 6️⃣ Run Frontend

```bash
npm start
```

---

# 📸 Screenshots

## Home Page

![Home Page](./docs/screenshots/home/1.png)
![Home Page](./docs/screenshots/home/2.png)
![Home Page](./docs/screenshots/home/3.png)
![Home Page](./docs/screenshots/home/4.png)

---

## Admin Dashboard

![Admin Dashboard](./docs/screenshots/admin_dashboard/1.png)
![Admin Dashboard](./docs/screenshots/admin_dashboard/2.png)
![Admin Dashboard](./docs/screenshots/admin_dashboard/3.png)
![Admin Dashboard](./docs/screenshots/admin_dashboard/4.png)
![Admin Dashboard](./docs/screenshots/admin_dashboard/5.png)
![Admin Dashboard](./docs/screenshots/admin_dashboard/6.png)
![Admin Dashboard](./docs/screenshots/admin_dashboard/7.png)
![Admin Dashboard](./docs/screenshots/admin_dashboard/8.png)
![Admin Dashboard](./docs/screenshots/admin_dashboard/9.png)

---

## Instructor Dashboard

![Instructor Dashboard](./docs/screenshots/instructor_dashboard/1.png)
![Instructor Dashboard](./docs/screenshots/instructor_dashboard/2.png)
![Instructor Dashboard](./docs/screenshots/instructor_dashboard/3.png)
![Instructor Dashboard](./docs/screenshots/instructor_dashboard/4.png)
![Instructor Dashboard](./docs/screenshots/instructor_dashboard/5.png)
![Instructor Dashboard](./docs/screenshots/instructor_dashboard/6.png)

---

## Student Dashboard

![Student Dashboard](./docs/screenshots/student_dashboard/1.png)
![Student Dashboard](./docs/screenshots/student_dashboard/2.png)
![Student Dashboard](./docs/screenshots/student_dashboard/3.png)
![Student Dashboard](./docs/screenshots/student_dashboard/4.png)
![Student Dashboard](./docs/screenshots/student_dashboard/5.png)

---

## Course Page

![Course Page](./docs/screenshots/courses/1.png)

---

## About Page

![About Page](./docs/screenshots/about/1.png)
![About Page](./docs/screenshots/about/2.png)

---

# 🚀 Future Improvements

- Payment Gateway Integration
- Live Classes
- Certificate Generation
- Quiz System
- Dark Mode

---

# 👨‍💻 Author

**Student Name:** Rahmatullah

---

# 📄 License

This project is developed for educational purposes only.

---

# 📢 Student Declaration

I confirm that this project is my own work and I have not copied it from any unauthorized source.

**Student Name:** Rahmatullah  
**Signature:** Rahmatullah  
**Date:** 30-05-2026