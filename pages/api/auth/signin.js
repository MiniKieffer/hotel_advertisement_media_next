import connectDB from "../../../utils/db";
import User from "../../../models/user";
import { generateToken } from "../../../utils/auth";

export default async function handler(req, res) {
    
  if (req.method === "POST") {
    const { email, password } = req.body;
    await connectDB();

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

      const token = generateToken(user._id);
      const username = user.name;
      res.status(200).json({ token, username });
    } catch (error) {
      res.status(500).json({ message: "Error signing in" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}