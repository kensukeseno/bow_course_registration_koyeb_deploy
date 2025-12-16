import express from "express";
import requireAuth from "../middleware/requiredAuth.js";
import { body } from "express-validator";
import {
  register,
  login,
  logout,
  updateProfile,
  getUser,
} from "../controllers/authController.js";

const router = express.Router();

//GET /api/auth/me
router.get("/me", requireAuth(), getUser);

//POST /api/auth/register
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  register
);

//POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

// PUT /api/auth/profile
router.put("/profile", requireAuth(), updateProfile);

router.post("/logout", logout);

export default router;
