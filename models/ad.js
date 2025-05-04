import mongoose from "mongoose";

const AdSchema = new mongoose.Schema({
  location: {type: String, required: true},
  video: { type: [String], required: true },
  cloudinary_id_vid: { type: [String] },
});


export default mongoose.models.Ad || mongoose.model("Ad", AdSchema);