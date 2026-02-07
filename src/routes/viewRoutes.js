import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizedRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => res.render("register"));


router.get("/dashboard", protect, (req, res) => {
  res.render("dashboard");
});

router.get("/admin/dashboard", protect, authorizedRoles("admin"), (req, res) => {
  res.render("admin/dashboard");
});

export default router;
