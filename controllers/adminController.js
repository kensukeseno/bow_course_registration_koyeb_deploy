import Course from "../models/course.js";
import User from "../models/user.js";
import Message from "../models/message.js";

// Get all student information
export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" });

    return res.status(200).json(students);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Create new course
export const createCourse = async (req, res) => {
  try {
    const {
      name,
      code,
      term,
      instructor,
      start,
      end,
      desc,
      status,
      department,
      credits,
      prerequisites,
    } = req.body;

    // Check if course with same code already exists
    const existingCourse = await Course.findOne({ code });
    if (existingCourse) {
      return res
        .status(400)
        .json({ message: "Course with this code already exists" });
    }

    const newCourse = new Course({
      _id: code, // Using course code as _id for uniqueness
      name,
      code,
      term,
      instructor,
      start,
      end,
      desc,
      status: status || "Active",
      department: department || "Computer Science",
      credits: credits || 3,
      prerequisites: prerequisites || "None",
    });

    await newCourse.save();
    return res.status(201).json(newCourse);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  try {
    const { code } = req.params;
    const {
      name,
      term,
      instructor,
      start,
      end,
      desc,
      status,
      department,
      credits,
      prerequisites,
    } = req.body;

    const course = await Course.findOne({ code });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update fields
    if (name) course.name = name;
    if (term) course.term = term;
    if (instructor) course.instructor = instructor;
    if (start) course.start = start;
    if (end) course.end = end;
    if (desc) course.desc = desc;
    if (status) course.status = status;
    if (department) course.department = department;
    if (credits) course.credits = credits;
    if (prerequisites) course.prerequisites = prerequisites;

    await course.save();
    return res.status(200).json(course);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const { code } = req.params;

    const course = await Course.findOneAndDelete({ code });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res
      .status(200)
      .json({ message: "Course deleted successfully", course });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// Gets all messages
export async function getMessages(req, res) {
  try {
    const messages = await Message.find({});
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ message: "Could not get messages" });
  }
}
