import { Request, Response } from 'express';
import Requirement from '../models/requirmentModel';
import { paginate } from '../utills/paginate';
import Quotation from '../models/quotationMode';

export const registerRequirement = async (req: any, res: Response) => {
    const userId = req.userId; // Assuming userId is retrieved from authentication middleware
    const {
        productId,
        quantity,
        minimumAmount,
        maximumAmount,
        frequency,
        totalOrders = 0,
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
    console.log("requirementByUserId");
    
    try {
        const userId = req.userId;
        console.log({userId});
        
        const requirements = await Requirement.find({ buyerId: userId }).populate({
            path: 'productId',
            select: 'name category subCategory image'
        }).exec(); res.status(201).json({
            requirement: requirements
        });
    } catch (error) {
        throw error;
    }
}

// only admin can access it
export const getRequirements = async (req: any, res: Response) => {
    const { page = 1, limit = 100 } = req.query;
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const userId = req.userId; // Assuming userId is retrieved from authentication middleware
    try {
        const requirements = await Requirement.find()
            .populate({
                path: 'productId',
                select: 'name category subCategory image',
            })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .lean();

        const requirementIds = requirements.map(requirement => requirement._id.toString());

        const quotations = await Quotation.find({
            requirementId: { $in: requirementIds }, sellerId: userId
        }).lean();

        const requirementsWithQuotations = requirements.map(requirement => {
            const requirementQuotations = quotations.filter(quotation => quotation.requirementId.toString() === requirement._id.toString());
            return { ...requirement, quotations: requirementQuotations };
        });

        res.status(200).json(requirementsWithQuotations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

