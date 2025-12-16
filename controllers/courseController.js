import Course from "../models/course.js";

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    return res.status(200).json(courses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get courses by term
export const getCoursesByTerm = async (req, res) => {
  try {
    const { term } = req.params;
    const courses = await Course.find({
      term: { $regex: term, $options: "i" },
    });
    return res.status(200).json(courses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get course by code
export const getCourseByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const course = await Course.findOne({ code });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    return res.status(200).json(course);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
