import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import User from "../models/user.js";

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } //keep users logged in longer if you like
  );
}

function setAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

const normalizeEmail = (value = "") => value.trim().toLowerCase();
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const buildEmailQuery = (email) => ({
  email: { $regex: new RegExp(`^${escapeRegex(email)}$`, "i") },
});

export async function getUser(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      birthday: user.birthday,
      department: user.department,
      program: user.program,
      country: user.country,
      role: user.role ?? "student",
    });
  } catch (err) {
    console.error("Failed to fetch authenticated user", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  let {
    // id,
    firstName,
    lastName,
    email,
    phone,
    birthday,
    department,
    program,
    country,
    password,
    role,
  } = req.body;
  email = normalizeEmail(email);

  try {
    const exists = await User.findOne(buildEmailQuery(email));
    if (exists) return res.status(409).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      // id,
      firstName,
      lastName,
      email,
      phone,
      birthday,
      department,
      program,
      country,
      password: hashed, //store hashed password
      role,
    });

    const token = generateToken(user);
    setAuthCookie(res, token);

    return res.status(201).json({
      id: user._id,
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      birthday: user.birthday,
      department: user.department,
      program: user.program,
      country: user.country,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  let { email, password } = req.body;
  email = normalizeEmail(email);

  try {
    const user = await User.findOne(buildEmailQuery(email));
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    let ok = false;
    const storedPassword = user.password || "";

    if (storedPassword.startsWith("$2")) {
      ok = await bcrypt.compare(password, storedPassword);
    } else {
      ok = storedPassword === password;
      if (ok) {
        user.password = await bcrypt.hash(password, 10);
        await user.save();
      }
    }

    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    setAuthCookie(res, token);

    return res.json({
      message: "Login successful",
      id: user._id,
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      birthday: user.birthday,
      department: user.department,
      program: user.program,
      country: user.country,
      role: user.role ?? "student",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

export function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ ok: true });
}

// Update  personal information
export async function updateProfile(req, res) {
  try {
    const { email, phone, birthday, program } = req.body; // Get form data
    const id = req.user.id; // Get ID from login
    const role = req.user.role;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (role === "student") {
      const validPrograms = [
        "Diploma (2 Years)",
        "Post-Diploma (1 Year)",
        "Certificate (6 Months)",
        "Bachelor (4 Years)",
      ];
      if (program && !validPrograms.includes(program)) {
        return res
          .status(400)
          .json({ message: "Please choose a valid program" });
      }
    }

    const updateData = {
      email: email.trim().toLowerCase(), // Clean up email format
      phone: phone || "", // Use empty string if no phone
      birthday: birthday || "", // Use empty string if no birthday
      program: program || role === "student" ? "Diploma (2 Years)" : "N/A", // Default program if none chosen
    };

    const updatedUser = await User.findByIdAndUpdate(
      id, // Find this user
      updateData, // Update with new data
      { new: true, runValidators: true } // Return updated record and validate
    ).select("-password"); // Don't include password in response

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profile: {
        id: updatedUser.id,
        email: updatedUser.email,
        phone: updatedUser.phone || "",
        birthday: updatedUser.birthday || "",
        program:
          updatedUser.program || role === "student"
            ? "Diploma (2 Years)"
            : "N/A",
      },
    });
  } catch (error) {
    // If the email is already used by another student
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Email already in use by another user" });
    }
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
}
