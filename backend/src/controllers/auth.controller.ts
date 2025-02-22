import { Request, Response } from 'express';
import authService from '../services/auth.service';

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      const user = await authService.register(username, email, password);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(400).json({ message: errMsg });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const token = await authService.login(email, password);
      res.status(200).json({ message: 'Login successful', token });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Invalid login attempt';
      res.status(401).json({ message: errMsg });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      // Depending on token handling strategy (e.g., JWT blacklist)
      res.status(200).json({ message: 'Logout successful' });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(400).json({ message: errMsg });
    }
  }
}

export default new AuthController();
