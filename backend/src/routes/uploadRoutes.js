import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
import uploadImage from "../controllers/uploadController.js";

const router = express.Router();

router.post(
  "/image",
  authMiddleware,
  upload.single("image"),
  uploadImage
);

export default router;