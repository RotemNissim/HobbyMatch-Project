import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IAdmin {
    firstName: string;
    lastName: string;
    _id?:string;
    refreshToken?:string[];
    password: string;
    email: string;
    role: 'admin';
}

const AdminSchema = new mongoose.Schema<IAdmin>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    refreshToken: { type: [String], default: [] },
    role: { type: String, default: 'admin' },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true }
});


const adminModel = mongoose.model<IAdmin>('Admin', AdminSchema);

export default adminModel;