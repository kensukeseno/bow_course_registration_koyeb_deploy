import Program from "../models/program.js";

// Get all programs
export const getPrograms = async (req, res) => {
  try {
    const programs = await Program.find({});
    return res.status(200).json(programs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
