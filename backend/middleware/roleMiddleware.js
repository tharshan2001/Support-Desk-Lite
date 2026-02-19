import User from "../models/user.js";

export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("role");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  };
};
