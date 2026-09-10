import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

// Verifies the Bearer token and attaches the admin document to req.admin
export async function protect(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated. Please log in." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(payload.sub);
    if (!admin) {
      return res.status(401).json({ message: "Account no longer exists." });
    }
    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Session expired or invalid. Please log in again." });
  }
}

// Use after `protect` to restrict a route to specific roles.
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({ message: "You don't have permission to do that." });
    }
    next();
  };
}
