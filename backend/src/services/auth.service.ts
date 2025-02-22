import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel, { IUser } from '../models/User.models';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const SALT_ROUNDS = 10;

class AuthService {
  async register(username: string, email: string, password: string) {
    // Check if user already exists (mocked for now)
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create new user
    const newUser = await userModel.create({ username, email, password: hashedPassword });
    return { id: newUser.id, username: newUser.username, email: newUser.email };
  }

  async login(email: string, password: string) {
    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    return token;
  }
}

export default new AuthService();
