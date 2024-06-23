import { Schema, model, Document, Types } from 'mongoose';

interface IUserAddress extends Document {
    userId: Types.ObjectId;
        latitude: number;
        longitude: number;
    city: string;
    state: string;
    zipcode: string;
    address: string;
    landmark?: string;
}

const userAddressSchema = new Schema<IUserAddress>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    latitude:{type: Number, required: true },
    longitude: { type: Number, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
    address: { type: String, required: true },
    landmark: { type: String }
}, {
    timestamps: true
});

const UserAddress = model<IUserAddress>('UserAddress', userAddressSchema);

export default UserAddress;
