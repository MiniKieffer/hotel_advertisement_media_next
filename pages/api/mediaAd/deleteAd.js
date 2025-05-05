import connectDB from "../../../utils/db";
import Ad from "../../../models/ad";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    await connectDB();

    try {
        const { ad_id } = req.body;
      await Ad.findByIdAndDelete(ad_id);
      res.status(201).json({message: "Ad successfully deleted"});
    } catch (error) {
      res.status(500).json({ message: "Error getting ads" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}