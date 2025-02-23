import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IAdmin extends Document {
    username: string;
    password: string;
    email: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema = new mongoose.Schema<IAdmin>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true }
});

AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

AdminSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

const adminModel = mongoose.model<IAdmin>('Admin', AdminSchema);

export default adminModel;