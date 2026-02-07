import express from "express";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  viewAuditLogs,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizedRoles } from "../middleware/roleMiddleware.js";


const router = express.Router();



router.get(
  "/dashboard",
  protect,
  authorizedRoles("admin", "demoAdmin"),
  getAllUsers
);


router.get(
  "/audit-logs",
  protect,
  authorizedRoles("admin"),
  viewAuditLogs
);


router.post(
  "/update-role/:id",
  protect,
  authorizedRoles("admin"),
  updateUserRole
);

router.post(
  "/delete/:id",
  protect,
  authorizedRoles("admin"),
  deleteUser
);

export default router;
