import { verifyToken } from "../utils/jwt.js";

export const protect = (req, res, next) => {
  const token = req.cookies?.SDL_token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }

  req.user = decoded; // this should include id
  next();
};
