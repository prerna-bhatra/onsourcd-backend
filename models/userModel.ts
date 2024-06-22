import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
    name: string;
    email: string;
    phone: string;
    password: string;
    isVerifiedEmail: boolean;
    isVerifiedPhone: boolean;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerifiedEmail: { type: Boolean, default: false },
    isVerifiedPhone: { type: Boolean, default: false },
}, {
    timestamps: true,
});

const User = model<IUser>('User', userSchema);

export default User;
