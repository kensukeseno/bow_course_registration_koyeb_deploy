import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    _id: {
    type: String,        //Making sure that _id = course code
  },
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  term: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: false,
    default: "",
  },
  status: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  prerequisites: {
    type: String,
    required: true,
  },
});

const Course = mongoose.model("Course", courseSchema);

export default Course;


