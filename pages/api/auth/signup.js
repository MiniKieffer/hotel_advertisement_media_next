import connectDB from "../../../utils/db";
import User from "../../../models/user";
import { generateToken } from "../../../utils/auth";

export default async function handler(req, res) {
  console.log('Inside API handler:', req.method);
  if (req.method === "POST") {
    const { name, email, password } = req.body;
    await connectDB();

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "User already exists" });

      const user = new User({ name, email, password });
      await user.save();

      const token = generateToken(user._id);
      const username = user.name;
      res.status(201).json({ token, username });
    } catch (error) {
      res.status(500).json({ message: "Error signing up user" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}