import { Router } from "express";
import { signup, login, me, invite, setupStatus } from "../controllers/authController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/setup-status", setupStatus);
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, me);
router.post("/invite", protect, requireRole("admin"), invite);

export default router;
