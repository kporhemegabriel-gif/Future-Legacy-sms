import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

function signToken(admin) {
  return jwt.sign(
    { sub: admin._id.toString(), role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function toPublicAdmin(admin) {
  return {
    id: admin._id,
    fullName: admin.fullName,
    email: admin.email,
    role: admin.role,
  };
}

// POST /api/auth/signup
// Open signup is only allowed for the very first account (the initial admin).
// After that, new staff/admin accounts must be created by an existing admin
// via POST /api/auth/invite (protected).
export const signup = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "Full name, email, and password are required." });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }

  const existingCount = await Admin.countDocuments();
  if (existingCount > 0) {
    return res.status(403).json({
      message:
        "Self sign-up is disabled once the first admin account exists. Ask an existing admin to create your account.",
    });
  }

  const passwordHash = await Admin.hashPassword(password);
  const admin = await Admin.create({ fullName, email, passwordHash, role: "admin" });

  const token = signToken(admin);
  res.status(201).json({ token, admin: toPublicAdmin(admin) });
});

// POST /api/auth/invite (protected, admin only)
// Lets a logged-in admin create additional admin/staff accounts.
export const invite = asyncHandler(async (req, res) => {
  const { fullName, email, password, role = "staff" } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "Full name, email, and password are required." });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }
  if (!["admin", "staff"].includes(role)) {
    return res.status(400).json({ message: "Role must be 'admin' or 'staff'." });
  }

  const passwordHash = await Admin.hashPassword(password);
  const admin = await Admin.create({ fullName, email, passwordHash, role });
  res.status(201).json({ admin: toPublicAdmin(admin) });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select(
    "+passwordHash"
  );
  if (!admin) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const match = await admin.comparePassword(password);
  if (!match) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = signToken(admin);
  res.json({ token, admin: toPublicAdmin(admin) });
});

// GET /api/auth/me (protected)
export const me = asyncHandler(async (req, res) => {
  res.json({ admin: toPublicAdmin(req.admin) });
});

// GET /api/auth/setup-status
// Tells the frontend whether to show "Sign up" (no admins yet) or "Log in".
export const setupStatus = asyncHandler(async (req, res) => {
  const count = await Admin.countDocuments();
  res.json({ needsSetup: count === 0 });
});
