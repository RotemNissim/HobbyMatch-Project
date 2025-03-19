import express, { NextFunction, Request, Response } from "express";
import userModel, { IUser } from '../models/User.models';
import adminModel, { IAdmin } from '../models/Admin.models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Document } from "mongoose";
import { AuthRequest } from '../middleware/AuthRequest';
import dotenv from 'dotenv';
import { OAuth2Client } from "google-auth-library";
dotenv.config();

// ✅ Post-creation user & admin types with guaranteed _id
type tUser = Document<unknown, {}, IUser> & IUser & Required<{ _id: string }> & { __v: number };
type tAdmin = Document<unknown, {}, IAdmin> & IAdmin & Required<{ _id: string; role: 'admin' }> & { __v: number };

const register = async (req: Request, res: Response): Promise<Response> => {
    try {
        console.log("🔍 Debug: Received request body:", req.body);

        const { firstName, lastName, email, password, role } = req.body;
        const profilePicture = req.file ? req.file.filename : '';

        if (!firstName || !lastName || !email || !password) {
            console.log("❌ Missing required fields!");
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        if (role === 'admin') {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                console.log("❌ No token provided for admin registration");
                return res.status(401).json({ message: 'Access Denied' });
            }

            try {
                const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string) as { role: string };

                if (decoded.role !== 'admin') {
                    console.log("❌ Forbidden: Requesting user is not an admin!");
                    return res.status(403).json({ message: 'Only admins can create new admins' });
                }
            } catch (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }

            const admin = await adminModel.create({ firstName, lastName, email, password: hashedPassword, role: 'admin' });
            return res.status(201).json({ message: 'Admin registered successfully', admin });
        }

        const user = await userModel.create({ firstName, lastName, email, password: hashedPassword, profilePicture});

        return res.status(201).json({ message: 'User registered successfully', user });

    } catch (err) {
        return res.status(400).json({ message: 'Error registering user', error: err });
    }
};

type tTokens = {
    accessToken: string,
    refreshToken: string
}

// ✅ Generate token directly from user/admin object
const generateToken = (account: tUser | tAdmin): tTokens => {
    const sk = process.env.TOKEN_SECRET as string;

    if (!sk) {
      throw new Error("Missing TOKEN_SECRET in environment")
    }

    const payload = {
        _id: account._id.toString(),
        role: ('role' in account && account.role) ? account.role : 'user' 
    };

    const expiresIn = process.env.TOKEN_EXPIRES || '3h'; 
    const refreshExpiresIn = process.env.REFRESH_TOKEN_EXPIRES || '7d';

    const accessToken = jwt.sign(payload, sk, { expiresIn: expiresIn as jwt.SignOptions["expiresIn"]});
    const refreshToken = jwt.sign(payload, sk, { expiresIn: refreshExpiresIn as jwt.SignOptions["expiresIn"]});

    return { accessToken, refreshToken };
};

const login = async (req: Request, res: Response): Promise<Response> => {
  try {
      const { email, password } = req.body;
      console.log("🙏 login attempt:", email);

      const user = await userModel.findOne({ email }).select("+password") as tUser | null;

      if (user) {
            console.log("🙏 user found:", user.email);
          const validPassword = await bcrypt.compare(password, user.password);
          if (!validPassword) {
              return res.status(400).json({ message: 'Invalid email or password' });
          }

          const tokens = generateToken(user);
          console.log("🔥 tokens:", tokens);

          user.refreshToken = user.refreshToken || [];
          user.refreshToken.push(tokens.refreshToken);
          await user.save();

          return res.status(200).json({
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              _id: user._id,
              role: 'user'
          });
      }

      const admin = await adminModel.findOne({ email }).select("+password") as tAdmin | null;
     

      if (admin) {
        console.log("🔥 Admin Found:", admin.email);
          const validPassword = await bcrypt.compare(password, admin.password);
          if (!validPassword) {
              return res.status(400).json({ message: 'Invalid email or password' });
          }

          const tokens = generateToken(admin);
          console.log("✅ Generated Tokens (Admin):", tokens);
          admin.refreshToken = admin.refreshToken || [];
          admin.refreshToken.push(tokens.refreshToken);
          await admin.save();

          return res.status(200).json({
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              _id: admin._id,
              role: 'admin'
          });
      }

      return res.status(400).json({ message: 'Invalid email or password' });

  } catch (err) {
      return res.status(400).json({ message: 'Error logging in', error: err });
  }
};
const verifyRefreshToken = (refreshToken: string | undefined) => {
  return new Promise<tUser | tAdmin>((resolve, reject) => {
      if (!refreshToken) return reject("fail");

      jwt.verify(refreshToken, process.env.TOKEN_SECRET!, async (err, payload: any) => {
          if (err) return reject("fail");

          const userId = payload._id;

          const user = await userModel.findById(userId) as tUser | null;
          if (user && user.refreshToken?.includes(refreshToken)) {
              user.refreshToken = user.refreshToken.filter(token => token !== refreshToken);
              await user.save();
              return resolve(user);
          }

          const admin = await adminModel.findById(userId) as tAdmin | null;
          if (admin && admin.refreshToken?.includes(refreshToken)) {
              admin.refreshToken = admin.refreshToken.filter(token => token !== refreshToken);
              await admin.save();
              return resolve(admin);
          }

          return reject("fail");
      });
  });
};

const logout = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        const account: tUser | tAdmin = await verifyRefreshToken(refreshToken);
        if (!account) return res.status(400).json({ message: "Invalid refresh token" });

        account.refreshToken = (account.refreshToken || []).filter(token => token !== refreshToken);
        await account.save();

        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(400).json({ message: "Logout failed", error: err });
    }
};

const refresh = async (req: Request, res: Response) => {
    try {
        const account : tAdmin | tUser = await verifyRefreshToken(req.body.refreshToken);
        if (!account) return res.status(400).send("fail");

        const tokens : tTokens = generateToken(account);
        //צריך לשמור במקום ולא לעשות פוש כדאי למנוע פגיע הגנתית
        (account.refreshToken || []).push(tokens.refreshToken);
        await account.save();

        res.status(200).json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            _id: account._id
        });
    } catch (err) {
        res.status(400).send("fail");
    }
};

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    console.log("🔥 Incoming request to:", req.url);
    console.log("🔥 Headers Received:", req.headers);

    const authorization = req.header("authorization");
    console.log("🔥 Authorization Header in Backend:", authorization);

    let token;

    if (authorization && authorization.startsWith("Bearer ")) {
        token = authorization.split(" ")[1];
        console.log("🔥 Extracted Token:", token);
    }

    // 🔥 2️⃣ If no token, check the cookie (Google login)
    if (!token && req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
        console.log("🔥 Token Found in Cookies:", token);
    }

  if (!token) {
    console.warn("🔥 No token found! Rejecting request.");
    res.status(401).json({ message: 'Access Denied' });
  return;
}
    

  try {
      const { _id } = jwt.verify(token, process.env.TOKEN_SECRET!) as { _id: string };
      console.log("🔥 Decoded Token ID:", _id);

      const admin = await adminModel.findById(_id) as tAdmin | null;  
      const user = await userModel.findById(_id) as tUser | null;

      if (user) {
        console.log("🔥 Regular User Found:", user.email);
          (req as any).user = user;
          return next();
      }
      
      if (admin) {
        console.log("🔥 Admin Found:", admin.email);
          (req as any).user = admin;
          return next();
      }
      console.log("Auth Middleware - Token ID:", _id);
        console.log("Checking User Model...");
        console.log("User Found:", user);

        console.log("Checking Admin Model...");
        console.log("Admin Found:", admin);
       res.status(401).json({ message: 'User not found' });
       return;

  } catch (err) {
      res.status(401).json({ message: 'Invalid Token' });
      return ;
  }
};

const client = new OAuth2Client(); 
const googleSignIn = async (req: Request, res:Response) => {
    console.log(req.body);
    try {
const ticket = await client.verifyIdToken({
        idToken: req.body.credential,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const email = payload?.email;
    if (email != null) {
        let user = await userModel.findOne({ 'email': email }) as tUser;
        if (user == null) {
            const rs = await userModel.create(
                {
                    'email': email,
                    'password': '',
                    'profilePicture': payload?.picture,
                    'firstName': payload?.given_name,
                    'lastName': payload?.family_name,
                    'googleId': payload?.sub,
                }
            )
        }
        const tokens = await generateToken(user);
        res.status(200).send({email: user.email, _id: user._id, ...tokens});
    }
    } catch (err) {
        return res.status(400).send(String(err));
    }  
}

export default {
    register: register as unknown as express.RequestHandler,
    login: login as unknown as express.RequestHandler,
    refresh: refresh as unknown as express.RequestHandler,
    logout: logout as unknown as express.RequestHandler,
    generateToken,
    authMiddleware: authMiddleware as unknown as express.RequestHandler,
    googleSignIn: googleSignIn as unknown as express.RequestHandler
};
