import { Document, Schema, model, Types } from 'mongoose';

interface Icompany extends Document {
    userId: Types.ObjectId;
    companyName: string;
    companyAddresss: string;
    gst: number;
    latitude: string;
    longitude: string;
    googleAddress: string;
    Occupation: string;
}

const companySchema = new Schema<Icompany>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, required: true },
    companyAddresss: { type: String, required: true },
    gst: { type: Number, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    googleAddress: { type: String, required: true },
    Occupation: { type: String, required: true },
}, {
    timestamps: true,
});

const Company = model<Icompany>('Company', companySchema);

export default Company;
