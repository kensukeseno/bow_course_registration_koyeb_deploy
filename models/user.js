import mongoose from "mongoose";
// import SignUpPage from "../../src/pages/SignupPage.jsx";

const userSchema = new mongoose.Schema({
  // id: {
  //   type: String,
  //   required: true,
  // },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  department: {
    type: String,
    // enum: SignUpPage.map((department) => department.department),
    required: true,
  },
  program: {
    type: String,
    required: false,
    default: "",
  },
  country: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "admin"],
  },
});

const User = mongoose.model("User", userSchema);

export default User;
