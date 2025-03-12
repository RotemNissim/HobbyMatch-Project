import express from "express";
const router = express.Router();
import authController from "../controllers/auth.controller";
import userModel from '../models/User.models';

import passport from 'passport';

// Redirect to Google
router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:5173/login' }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect('http://localhost:5173/login?error=user_not_found');
      }

      const user = req.user as any;
      console.log("Authenticated User:", user); // ✅ Debugging

      if (!user._id) {
        return res.redirect('http://localhost:5173/login?error=missing_id');
      }
      const userId = user._id.toString();
      console.log("User ID:", userId); // ✅ Debugging

      const tokens = authController.generateToken(user);
      console.log("Generated tokens:", tokens);

      await userModel.findByIdAndUpdate(user._id, { 
        $push: { refreshToken: tokens.refreshToken } 
      });

      res.cookie("accessToken", tokens.accessToken, {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: "strict",
      });

      return res.redirect('http://localhost:5173/profile');
    } catch (error) {
      console.error("Google Auth Callback Error:", error);
      return res.redirect('http://localhost:5173/login?error=server_error');
    }
  }
);



router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.post("/register", authController.register);

export default router;
