import express from 'express';
import { registerUser, loginUser, getProtectedData, logoutUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';


const router = express.Router();




router.post("/register", authLimiter, registerUser);

router.post("/login", authLimiter, loginUser);


router.get("/logout", protect, logoutUser);


router.get("/protected", protect, getProtectedData );










export default router;