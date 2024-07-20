import { Schema, model, Document } from 'mongoose';

// Interface for Quotation
interface IQuotation extends Document {
    requirementId: Schema.Types.ObjectId;
    estimatedPrice: number;
    sellerId: Schema.Types.ObjectId;
    gst: boolean;
    transportAvailability: boolean;
    qualityDescription: string;
    status: 'rejected' | 'accepted' | 'pending';
}

// Quotation Schema
const quotationSchema = new Schema<IQuotation>({
    requirementId: { type: Schema.Types.ObjectId, ref: 'Requirement', required: true },
    estimatedPrice: { type: Number, required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    gst: { type: Boolean, required: true  ,default:false  },
    transportAvailability: { type: Boolean, required: true , default:false },
    qualityDescription: { type: String, required: true  },
    status: { type: String, enum: ['rejected', 'accepted', 'pending'], default: 'pending' },
}, {
    timestamps: true,
});

// Create Quotation model
const Quotation = model<IQuotation>('Quotation', quotationSchema);

export default Quotation;
