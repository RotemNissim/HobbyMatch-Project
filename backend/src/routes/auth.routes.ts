import express from "express";
const router = express.Router();
import authController from "../controllers/auth.controller";

import passport from 'passport';

// Redirect to Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback (Google redirects back here after user approves)
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login',
}), (req, res) => {
    // Successful login - Redirect to frontend with token in URL (optional)
    const user = req.user as any;
    const tokens = authController.generateToken(user._id.toString());

    if (tokens) {
        // Option 1: Store in cookie
        res.cookie('accessToken', tokens.accessToken, { httpOnly: true });

        // Option 2: Redirect with token in URL (less secure)
        res.redirect(`http://localhost:5173/profile?token=${tokens.accessToken}`);
    } else {
        res.redirect('http://localhost:5173/login?error=token');
    }
});


router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.post("/register", authController.register);

export default router;
