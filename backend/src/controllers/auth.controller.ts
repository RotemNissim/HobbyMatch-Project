import  express , {NextFunction, Request, Response } from "express";
import userModel, { IUser } from '../models/User.models';
import adminModel, {IAdmin} from '../models/Admin.models';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload} from 'jsonwebtoken';
import { Document } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log("🔍 Debug: Received request body:", req.body);

    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      console.log("❌ Missing required fields!");
      return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 If registering an admin, enforce authentication
    if (role === 'admin') {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        console.log("❌ No token provided for admin registration");
        return res.status(401).json({ message: 'Access Denied' });
      }

      try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string) as { role: string };

        console.log("✅ Token decoded successfully:", decoded);

        if (decoded.role !== 'admin') {
          console.log("❌ Forbidden: Requesting user is not an admin!");
          return res.status(403).json({ message: 'Only admins can create new admins' });
        }
      } catch (err) {
        console.log("❌ Invalid Token");
        return res.status(403).json({ message: 'Invalid token' });
      }

      console.log("✅ Admin authorization passed!");

      const admin = await adminModel.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: 'admin'
      });

      return res.status(201).json({ message: 'Admin registered successfully', admin });
    }

    // Default: Register as a user (No authentication required)
    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    return res.status(201).json({ message: 'User registered successfully', user });

  } catch (err) {
    console.log("❌ Error registering user:", err);
    return res.status(400).json({ message: 'Error registering user', error: err });
  }
};

type tTokens = {
  accessToken: string,
  refreshToken: string
}

const generateToken = (userId: string, role?: string): tTokens | null => {
  const sk = process.env.TOKEN_SECRET as string;
  const random = Math.random().toString();
  const payload: any = {
    _id: userId, 
    random: random
  };
  if (role) {
    payload.role = role;
  }
  const expiresIn = process.env.TOKEN_EXPIRES || '3h'; // Fallback in case of undefined
  const refreshExpiresIn = process.env.REFRESH_TOKEN_EXPIRES || '7d';
  if (!sk) {
      return null;
  }
  
  // generate access token
  const accessToken = jwt.sign(payload, sk, { expiresIn: expiresIn as jwt.SignOptions["expiresIn"]});

  // generate refresh token
  const refreshToken = jwt.sign(payload, sk, { expiresIn: refreshExpiresIn as jwt.SignOptions["expiresIn"]});

  return {
      accessToken,
      refreshToken
  };
};

const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    console.log(`🔍 Logging in: ${email}`);

    // 🔥 Force Mongoose to return password using select()
    let account = await userModel.findOne({ email }).select("+password");

    if (!account) {
      account = await adminModel.findOne({ email }).select("+password");
    }

    if (!account) {
      console.log('❌ No account found with this email');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log(`✅ Account found: ${account.email}, Role: ${(account as any).role}`);
    console.log("🔍 Debug: Retrieved account object:", account);

    if (!account.password) {
      console.log('❌ Error: Password is still missing in the database!');
      return res.status(500).json({ message: 'Server error: Password field not retrieved' });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, account.password);
    if (!validPassword) {
      console.log('❌ Password does not match');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Ensure role is assigned correctly
    const role = (account as any).role || 'user';

    console.log(`🔑 Assigning role: ${role}`);

    // Generate JWT token with role
    const tokens = generateToken(account._id.toString(), role);

    if (!tokens) {
      console.log('❌ Token generation failed');
      return res.status(500).json({ message: 'Token generation failed' });
    }

    console.log(`✅ Token generated for ${email}`);

    if (!account.refreshToken) {
      account.refreshToken = [];
    }
    account.refreshToken.push(tokens.refreshToken);
    await account.save();

    console.log(`✅ User logged in: ${email}`);

    return res.status(200).json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _id: account._id,
      role: role,
    });

  } catch (err) {
    console.error('❌ Error in login function:', err);
    return res.status(400).json({ message: 'Error logging in', error: err });
  }
};

type tUser = Document<unknown, {}, IUser> & IUser & Required<{
  _id: string;
}> & {
  __v: number;
}
const verifyRefreshToken = (refreshToken: string | undefined) => {
  return new Promise<tUser>((resolve, reject) => {
    if (!refreshToken) {
      console.log("❌ No refresh token provided");
      return reject("fail");
    }

    if (!process.env.TOKEN_SECRET) {
      console.log("❌ No TOKEN_SECRET found");
      return reject("fail");
    }

    jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err: any, payload: any) => {
      if (err) {
        console.log("❌ Token verification failed:", err.message);
        return reject("fail");
      }

      const userId = payload._id;
      try {
        // 🔥 Check both user and admin collections
        let user = await userModel.findById(userId);
        if (!user) {
          user = await adminModel.findById(userId);  // ✅ Try finding an admin
        }

        if (!user) {
          console.log("❌ User/Admin not found");
          return reject("fail");
        }

        if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
          console.log("❌ Refresh token not found in user/admin database");
          user.refreshToken = [];
          await user.save();
          return reject("fail");
        }

        user.refreshToken = user.refreshToken.filter((token) => token !== refreshToken);
        await user.save();

        resolve(user);
      } catch (err) {
        console.log("❌ Database error:", err);
        return reject("fail");
      }
    });
  });
};

const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;  // ✅ Extract refresh token from request body

    console.log("🔍 Logout request received with refreshToken:", refreshToken);  // Debugging

    if (!refreshToken) {
      console.log("❌ No refresh token provided");
      return res.status(400).json({ message: "No refresh token provided" });
    }

    const user = await verifyRefreshToken(refreshToken);
    if (!user) {
      console.log("❌ Invalid refresh token");
      return res.status(400).json({ message: "Invalid refresh token" });
    }

    console.log("✅ User found, removing refresh token");

    // Remove the refresh token from the database
    user.refreshToken = user.refreshToken?.filter(token => token !== refreshToken);
    await user.save();

    return res.status(200).json({ message: "Logged out successfully" });

  } catch (err) {
    console.error("❌ Logout error:", err);
    return res.status(400).json({ message: "Logout failed", error: err });
  }
};

  const refresh = async (req: Request, res: Response) => {
    try {
        const user = await verifyRefreshToken(req.body.refreshToken);
        if (!user) {
            res.status(400).send("fail");
            return;
        }
        const tokens = generateToken(user._id);

        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        await user.save();
        res.status(200).send(
            {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                _id: user._id
            });
        //send new token
    } catch (err) {
        res.status(400).send("fail");
    }
};
export interface AuthPayLoad extends JwtPayload {
  _id: string;
  role?: string;
}
export interface AuthRequest extends Request {
  user?: AuthPayLoad;
}
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authorization = req.header('authorization');
    const token = authorization && authorization.split(' ')[1];

    if (!token) {
        res.status(401).send('Access Denied');
        return;
    }
    console.log("🔑 Current TOKEN_SECRET:", process.env.TOKEN_SECRET);

    if (!process.env.TOKEN_SECRET) {
        res.status(500).send('Server Error');
        return;
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if (err) {
          console.log("❌ Invalid Token Signature");
            res.status(401).send('Access Denied');
            return;
        }
        req.user = payload as AuthPayLoad; 
        next();
    });
};

export default {
    register: register as unknown as express.RequestHandler,
    login : login as unknown as express.RequestHandler,
    refresh,
    logout : logout as unknown as express.RequestHandler,
    generateToken
};
