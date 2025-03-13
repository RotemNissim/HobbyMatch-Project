import { Request } from 'express';
import { IUser } from '../models/User.models';
import { IAdmin } from '../models/Admin.models';

// This type allows `user` to be either a regular user or an admin
export type AuthUser = (IUser & { _id: string }) | (IAdmin & { _id: string });

export interface AuthRequest extends Request {
    user: AuthUser;  // authMiddleware guarantees this exists
    admin: AuthUser; 
}
