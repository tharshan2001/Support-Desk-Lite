import { verifyToken } from "../utils/jwt.js";

export const protect = (req, res, next) => {
  
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  // Verify the token
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }

  // Attach user info to request object
  req.user = decoded;
  next();
};
