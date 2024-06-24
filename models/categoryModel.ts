import { Schema, model, Document } from 'mongoose';

interface Icategory extends Document {
    name: string;

}

const categorySchema = new Schema<Icategory>({
    name: { type: String, required: true },
}, {
    timestamps: true,
});

const Category = model<Icategory>('Category', categorySchema);

export default Category;
