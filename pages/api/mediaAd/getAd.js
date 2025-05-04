import connectDB from "../../../utils/db";
import Ad from "../../../models/ad";

export default async function handler(req, res) {
  if (req.method === "GET") {
    await connectDB();

    try {
      const ad = await Ad.find();
      res.status(201).json(ad);
    } catch (error) {
      res.status(500).json({ message: "Error getting ads" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}