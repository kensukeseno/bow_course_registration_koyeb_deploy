import mongoose from "mongoose";

const programSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  term: {
    type: String,
    required: true,
    unique: true,
  },
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
  fees: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
});

const Program = mongoose.model("Program", programSchema);

export default Program;
