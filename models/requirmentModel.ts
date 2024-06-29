import { Document } from 'mongoose';
import { Schema, model } from 'mongoose';

enum Frequency {
    Daily = 'Daily',
    Weekly = 'Weekly',
    Monthly = 'Monthly',
    OneTime = 'One-time'
}

interface Requirement extends Document {
    buyerId: string; // Reference to User model
    productId: string;
    quantity: number;
    minimumAmount: number;
    maximumAmount: number;
    frequency: Frequency;
    totalOrders: number;
    expectedDeliveryDate?: Date;
    expectedStartDate?: Date;
    expectedEndDate?: Date;
    description: string;
    deliveryAddress: string;
    latitude: number;
    longitude: number;
    deliveryCity: string;
    deliveryState: string;
    deliveryZipCode: string;
}

const FrequencyEnum = ['Daily', 'Weekly', 'Monthly', 'One-time'];

const RequirementSchema: Schema = new Schema({
    buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true },
    minimumAmount: { type: Number, required: true },
    maximumAmount: { type: Number, required: true },
    frequency: { type: String, enum: FrequencyEnum, required: true },
    totalOrders: { type: Number, required: true },
    expectedDeliveryDate: { type: Date },
    expectedStartDate: { type: Date },
    expectedEndDate: { type: Date },
    description: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    deliveryCity: { type: String, required: true },
    deliveryState: { type: String, required: true },
    deliveryZipCode: { type: String, required: true }
});

const Requirement = model<Requirement>('Requirement', RequirementSchema);

export default Requirement;

