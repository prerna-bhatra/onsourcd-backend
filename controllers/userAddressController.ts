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

    console.log({ userId });

    try {
        // Make sure the userId is being correctly passed as a query parameter
        const addresses = await UserAddress.find({ userId });

        console.log({addresses})

        if (addresses.length > 0) {
            res.status(200).json(addresses); // Return addresses when found
        } else {
            res.status(404).json({ message: 'No addresses found' }); // Return message when no addresses are found
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




