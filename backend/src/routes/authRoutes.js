import express from "express";

import {
  login,
  refresh,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);

router.post("/refresh", refresh);

router.get("/protected", protect, (req, res) => {
  res.status(200).json({
    message: "You have access to this protected route",
    user: req.user,
  });
});

export default router;