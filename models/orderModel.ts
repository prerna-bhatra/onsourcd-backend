import { Schema, model, Document } from 'mongoose';

// Interface for Order
interface IOrder extends Document {
    requirementId: Schema.Types.ObjectId;
    estimatedPrice: number;
    sellerId: Schema.Types.ObjectId;
    buyerId: Schema.Types.ObjectId;
    productId: Schema.Types.ObjectId;
    quotationId: Schema.Types.ObjectId;
    transportAvailability: boolean;
    // qualityDescription: string;
    expectedDate: Date;
    completedDate: Date;
    status: string;
    expectedStartDate: Date;
    expectedEndDate: Date;
    frequency: string;
    paymentProgress: string;
}

// Order Schema
const ordersSchema = new Schema<IOrder>({
    requirementId: { type: Schema.Types.ObjectId, ref: 'Requirement', required: true },
    estimatedPrice: { type: Number, required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quotationId: { type: Schema.Types.ObjectId, ref: 'Quotation', required: true },
    transportAvailability: { type: Boolean, required: true, default: false },
    expectedDate: { type: Date },
    completedDate: { type: Date },
    status: { type: String, default: 'pending' },
    expectedStartDate: { type: Date, required: true },
    expectedEndDate: { type: Date, required: true },
    frequency: { type: String, required: true },
    paymentProgress: { type: String, enum: ['in-transit', 'received'], default: 'in-transit' },

}, {
    timestamps: true,
});

// Create Order model
const Order = model<IOrder>('Order', ordersSchema);

export default Order;
