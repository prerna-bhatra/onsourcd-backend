import { Schema, model, Document, Types } from 'mongoose';

interface IProduct extends Document {
    name: string;
    gst: number;
    category: Types.ObjectId;
    subCategory: Types.ObjectId;
    image:string;

}

const productSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: Schema.Types.ObjectId, ref: 'SubCategory', required: true },
    gst: { type: Number, required: true },
    image:{type:String}


}, {
    timestamps: true,
});

const Product = model<IProduct>('Product', productSchema);

export default Product;
