const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");

dotenv.config();

const connectDB = require("./config/db");

const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");

// Route Imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
// ✅ NEW IMPORT: Adding custom category routing matrix
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

/**
 * ============================
 * DATABASE CONNECTION
 * ============================
 */
connectDB();

/**
 * ============================
 * MIDDLEWARE
 * ============================
 */

// Configure CORS to support video streaming and range headers origin: process.env.FRONTEND_URL,
app.use(
  cors({
    origin: function (origin, callback) {
      // Agar request local ho, main domain se ho, ya netlify ke kisi bhi deploy preview se ho
      if (!origin || 
          origin === "https://lmsbymalik-rahmat.netlify.app" || 
          origin.endsWith(".netlify.app") || 
          origin.startsWith("http://localhost")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Range"],
    exposedHeaders: ["Content-Range", "Accept-Ranges", "Content-Length"],
    credentials: true,
  })
);

// Parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware (Helmet) with video streaming support
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Logging middleware (only in development mode)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/**
 * ============================
 * STATIC FILES (Uploads + Public)
 * ============================
 */

// Serve uploaded files with proper headers for video streaming
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// Serve public folder for frontend build
app.use(express.static(path.join(__dirname, "public")));

/**
 * ============================
 * API ROUTES
 * ============================
 */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/categories", categoryRoutes);

/**
 * ============================
 * TEST ROUTE
 * ============================
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LMS API is running successfully 🚀",
  });
});


/**
 * ============================
 * ERROR HANDLING
 * ============================
 */
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// Handle SPA routing (React/Angular/Vue frontend)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/**
 * ============================
 * SERVER START
 * ============================
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    ` Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});