import { Schema, model, Document, Types } from 'mongoose';

interface IProduct extends Document {
    name: string;
    gst: number;
    category: Types.ObjectId;
    subCategory: Types.ObjectId;
    image: string;
    commission: number;
    description: string;
    isArchive: boolean;
}

const productSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: Schema.Types.ObjectId, ref: 'SubCategory', required: true },
    commission: { type: Number, required: false, default: 0 },
    description: { type: String },
    gst: { type: Number, required: true },
    image: { type: String },
    isArchive: { type: Boolean, default: false }
}, {
    timestamps: true,
});

const Product = model<IProduct>('Product', productSchema);

export default Product;
