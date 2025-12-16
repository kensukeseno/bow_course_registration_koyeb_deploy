import express from "express";
import {
  getEnrolledCourses,
  getStudentNotifications,
  signupForCourse,
  deleteStudentFromCourse,
  createMessage,
} from "../controllers/studentController.js";

const router = express.Router();

// GET /api/student/enrolled-courses
router.get("/enrolled-courses", getEnrolledCourses);

// GET /api/student/notifications
router.get("/notifications", getStudentNotifications);

// POST /api/student/register-course
router.post("/register-course", signupForCourse);

// DELETE /api/student/unenroll-course
router.delete("/unenroll-course", deleteStudentFromCourse);

// POST /api/student/submit-message
router.post("/submit-message", createMessage);

export default router;
