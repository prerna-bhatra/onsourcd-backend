import { Request, Response } from 'express';
import Requirement from '../models/requirmentModel';
import { paginate } from '../utills/paginate';

export const registerRequirement = async (req: any, res: Response) => {
    const userId = req.userId; // Assuming userId is retrieved from authentication middleware
    const {
        productId,
        quantity,
        minimumAmount,
        maximumAmount,
        frequency,
        totalOrders=0,
        expectedDeliveryDate,
        expectedStartDate,
        expectedEndDate,
        description,
        deliveryAddress,
        latitude,
        longitude,
        deliveryCity,
        deliveryState,
        deliveryZipCode
    } = req.body;

    try {
        const newRequirement = await Requirement.create({
            buyerId: userId, // Assuming userId is populated from authentication middleware
            productId,
            quantity,
            minimumAmount,
            maximumAmount,
            frequency,
            totalOrders,
            expectedDeliveryDate,
            expectedStartDate,
            expectedEndDate,
            description,
            deliveryAddress,
            latitude,
            longitude,
            deliveryCity,
            deliveryState,
            deliveryZipCode
        });

        if (newRequirement) {
            res.status(201).json({
                requirement: newRequirement
            });
        } else {
            res.status(400).json({ message: 'Invalid Requirement data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


export const requirementByUserId = async (req: any, res: Response) => {
    try {
        const userId = req.userId;
        const requirements = await Requirement.find({ buyerId: userId }).populate("productId")
        res.status(201).json({
            requirement: requirements
        });
    } catch (error) {
        throw error;
    }
}

// only admin can access it
export const getRequirements = async (req: Request, res: Response) => {
    const { page = 1, limit = 100 } = req.query;
    
    try {
        const result = await paginate(Requirement, { page: +page, limit: +limit });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

