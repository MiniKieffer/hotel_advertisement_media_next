export default function handler(req, res) {
    if (req.method === "POST") {
      res.status(200).json({ message: "Signed out successfully" });
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  }