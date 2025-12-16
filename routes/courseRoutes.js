import express from "express";
import {
  getCourses,
  getCoursesByTerm,
  getCourseByCode,
} from "../controllers/courseController.js";

const router = express.Router();

// Get all courses
router.get("/courses", getCourses);

// Get courses by term
router.get("/courses/term/:term", getCoursesByTerm);

// Get course by code
router.get("/courses/:code", getCourseByCode);

export default router;
