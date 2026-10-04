import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import multer from "multer";

import pool from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import aboutRoutes from "./src/routes/aboutRoutes.js";
import skillsRoutes from "./src/routes/skillsRoutes.js";
import projectsRoutes from "./src/routes/projectsRoutes.js";
import blogsRoutes from "./src/routes/blogsRoutes.js";
import experienceRoutes from "./src/routes/experienceRoutes.js";
import testimonialsRoutes from "./src/routes/testimonialsRoutes.js";
import servicesRoutes from "./src/routes/servicesRoutes.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";
import contactRoutes from "./src/routes/contactRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";

dotenv.config();

const app = express();


app.use(
  cors({
    origin: process.env.ADMIN_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());


app.use("/auth", authRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/blogs", blogsRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/services", servicesRoutes);
app.use("/upload", uploadRoutes);
app.use("/contact", contactRoutes);
app.use("/api/messages", messageRoutes);


app.get("/", (req, res) => {
  res.json({
    message: "Portfolio CMS API is running",
  });
});


app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "API and database are working",
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});


app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err.message === "Only image files are allowed") {
    return res.status(400).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: "Something went wrong",
    error: err.message,
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});