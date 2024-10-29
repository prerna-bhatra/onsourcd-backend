import { Schema, model, Document, Types } from 'mongoose';

interface ISubcategory extends Document {
    name: string;
    category: Types.ObjectId;
}

const subCategorySchema = new Schema<ISubcategory>({
    name: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
}, {
    timestamps: true,
});

const SubCategory = model<ISubcategory>('SubCategory', subCategorySchema);

export default SubCategory;
