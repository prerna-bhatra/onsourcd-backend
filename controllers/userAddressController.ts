import { Request, Response } from 'express';
import UserAddress from '../models/userAddressModel';

export const addUserAddress = async (req: Request, res: Response) => {
    const { userId, coordinates, city, state, zipcode, address, landmark } = req.body;

    try {
        const userAddress = new UserAddress({
            userId,
            coordinates,
            city,
            state,
            zipcode,
            address,
            landmark
        });

        const savedAddress = await userAddress.save();

        res.status(201).json(savedAddress);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};





