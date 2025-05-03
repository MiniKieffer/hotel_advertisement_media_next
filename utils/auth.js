import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  return jwt.sign({ userId }, "63d073f9e48a26c476f482813f8f36f396b3a6dc5f39c2deb78b094965d82a78601a5fc12cf0f8526d15cd0632f8401afd97b1b835994d4a2bd7197630c03ccb", { expiresIn: "1d" });
};

export const verifyToken = (token) => {
  return jwt.verify(token, "63d073f9e48a26c476f482813f8f36f396b3a6dc5f39c2deb78b094965d82a78601a5fc12cf0f8526d15cd0632f8401afd97b1b835994d4a2bd7197630c03ccb");
};