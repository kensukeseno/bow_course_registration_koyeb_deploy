import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  courseCode: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  term: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;