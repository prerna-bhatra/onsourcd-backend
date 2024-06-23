import { Request, Response } from 'express';
import UserAddress from '../models/userAddressModel';

export const addUserAddress = async (req: Request, res: Response) => {
    const { userId, latitude, longitude, city, state, zipcode, address, landmark } = req.body;

    try {
        const userAddress = new UserAddress({
            userId,
            latitude,
            longitude,
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


export const getUserAddressByUserId = async (req: Request, res: Response) => {
    const { userId } = req.query;

    try {
        const addresses = await UserAddress.find({ userId })

        if (addresses) {
            res.status(201).json([]);
        }
        else {
            res.status(201).json(addresses);

        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getUserAddressById = async (req: Request, res: Response) => {
    const { id } = req.query;

    try {
        const addresses = await UserAddress.find({ _id: id })

        res.status(201).json(addresses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};




