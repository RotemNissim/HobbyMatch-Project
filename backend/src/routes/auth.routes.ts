import express from "express";
const router = express.Router();
import authController from "../controllers/auth.controller";

import passport from 'passport';

// Redirect to Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }), 
    async (req, res) => {
        const user = req.user as any;

        if (!user || !user._id) {
            return res.redirect('http://localhost:5173/login?error=user_not_found');
        }

        const tokens = authController.generateToken(user._id.toString());

        if (!tokens) {
            return res.redirect('http://localhost:5173/login?error=token_generation_failed');
        }

        // Set both tokens in secure HttpOnly cookies
        res.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            secure: false,    // Set to true in production (https)
            sameSite: 'strict'
        });

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        });

        // Redirect to profile (no token in URL!)
        res.redirect('http://localhost:5173/profile');
    }
);


router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.post("/register", authController.register);

export default router;
