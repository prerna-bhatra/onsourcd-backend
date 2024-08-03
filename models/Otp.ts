import { Schema, model, Document } from 'mongoose';

interface IOtp extends Document {
    email: string;
    otp: number;
}

const otpSchema = new Schema<IOtp>({
    email: { type: String },
    otp: { type: Number }
}, {
    timestamps: true,
});

const Otp = model<IOtp>('Otp', otpSchema);

export default Otp;
