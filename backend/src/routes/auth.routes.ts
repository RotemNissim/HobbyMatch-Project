import express from "express";
const router = express.Router();
import authController from "../controllers/auth.controller";


router.post("/google", authController.googleSignIn);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.post("/register", authController.register);

export default router;
