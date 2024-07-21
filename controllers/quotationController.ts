// controllers/quotationController.ts
import { Request, Response } from 'express';
import Quotation from '../models/quotationMode';
import Requirement from '../models/requirmentModel';
import { Types } from 'mongoose';
import Order from '../models/orderModel';


// Add new Quotation
export const addQuotation = async (req: any, res: Response) => {
    try {
        const userId = req.userId;

        const { requirementId } = req.params;

        const {
            estimatedPrice,
            gst,
            qualityDescription,
            transportAvailability
        } = req.body;

        const newRequirementId = new Types.ObjectId(requirementId);

        const filter = {
            requirementId: newRequirementId,
            sellerId: new Types.ObjectId(userId)
        };

        const update = {
            estimatedPrice,
            gst,
            qualityDescription,
            transportAvailability
        };

        const options = {
            new: true, // Return the updated document
            upsert: true // Create a new document if none exists
        };

        const saveQuotation = await Quotation.findOneAndUpdate(filter, update, options);

        res.status(201).send(saveQuotation);
    } catch (error) {

        res.status(505).send(error);
    }
};

// Fetch by Requirement ID
export const getQuotationsByRequirementId = async (req: Request, res: Response) => {
    try {
        const quotations = await Quotation.find({ requirementId: req.params.requirementId });
        if (!quotations) {
            return res.status(500).send();
        }
        res.send(quotations);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getQuotationsByRequirementIdAndUserID = async (req: any, res: Response) => {
    try {
        const userId = req.userId
        const quotations = await Quotation.find({ requirementId: req.params.requirementId, sellerId: userId });
        if (!quotations) {
            return res.status(500).send();
        }
        res.send(quotations);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Fetch by Seller ID
export const getQuotationsBySellerId = async (req: any, res: Response) => {
    try {
        const userId = req.userId;

        const quotations = await Quotation.find({ sellerId: userId });
        if (!quotations) {
            return res.status(500).send();
        }
        res.send(quotations);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Fetch by ID
export const getQuotationById = async (req: Request, res: Response) => {
    try {
        const quotation = await Quotation.findById(req.params.id);
        if (!quotation) {
            return res.status(500).send();
        }
        res.send(quotation);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Fetch all Quotations
export const getAllQuotations = async (req: Request, res: Response) => {
    try {
        const quotations = await Quotation.find({});
        res.send(quotations);
    } catch (error) {
        res.status(500).send(error);
    }
};

// accept an order and reject others
export const updateQuotationStatus = async (req: Request, res: Response) => {
    try {
        // quotation ID 
        const { id } = req.params;

        console.log({ id });


        const quotation = await Quotation.findByIdAndUpdate(
            id,
            { status: "accepted" },
            { new: true, runValidators: true }
        );

        console.log({ quotation });


        const rejectQuotation = await Quotation.updateMany({
            requirementId: quotation?.requirementId,
            _id: { $ne: id } // Exclude the current quotation
        }, {
            status: "rejected"
        });
        // also set closed status for that requirement
        const closeRequirement = await Requirement.updateOne({
            _id: quotation?.requirementId,
        }, {
            status: "closed"
        });


        console.log({ rejectQuotation });


        const requirement: any = await Requirement.findOne({ _id: quotation?.requirementId });
        const quotationData: any = await Quotation.findOne({ _id: id })

        const savedOrders = await createOrder(
            quotationData.sellerId,
            requirement.buyerId,
            requirement?.totalOrders,
            quotationData.estimatedPrice,
            quotationData?._id,
            quotationData?.requirementId,
            requirement?.expectedStartDate,
            requirement?.expectedEndDate,
            requirement?.frequency,
            requirement?.productId
        )

        console.log({ savedOrders });


        res.send(savedOrders);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const createOrder = async (
    sellerId: any,
    buyerId: any,
    totalOrders: any,
    estimatedPrice: any,
    quotationId: any,
    requirementId: string,
    expectedStartDate: Date,
    expectedEndDate: Date,
    frequency: string,
    productId: string
) => {
    try {
        const orders = [];

        let currentDate = new Date(expectedStartDate);

        for (let i = 0; i < totalOrders; i++) {
            // Calculate next expectedDate based on frequency
            switch (frequency.toLowerCase()) {
                case 'daily':
                    currentDate.setDate(currentDate.getDate() + 1);
                    break;
                case 'weekly':
                    currentDate.setDate(currentDate.getDate() + 7);
                    break;
                case 'monthly':
                    currentDate.setMonth(currentDate.getMonth() + 1);
                    break;
                case 'one time':
                    if (i > 0) break; // Only create one order if frequency is one time
                    break;
                default:
                    throw new Error('Invalid frequency');
            }

            // Ensure currentDate does not exceed expectedEndDate
            if (currentDate > new Date(expectedEndDate)) break;

            // Create order object
            const order = new Order({
                requirementId,
                estimatedPrice,
                sellerId,
                buyerId,
                productId, // Set productId as needed
                quotationId,
                transportAvailability: false,
                expectedDate: new Date(currentDate),
                status: 'pending',
                expectedStartDate: new Date(expectedStartDate),
                expectedEndDate: new Date(expectedEndDate),
                frequency
            });

            orders.push(order);
        }

        // Save orders to the database
        const savedOrders = await Order.insertMany(orders);

        console.log({ savedOrders });


        return savedOrders;
    } catch (error) {
        console.error(error);
        return error;
    }
}

export const getOrderById = async (orderId: string) => {
    try {
        const order = await Order.findById(orderId).exec();
        return order;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getOrdersByRequirement = async (req: any, res: any) => {
    try {
        const { id } = req.params

        console.log({ id });

        const orders = await Order.find({ requirementId: new Types.ObjectId(id) });
        console.log({ orders });

        res.status(201).send(orders);
        return orders;
    } catch (error) {
        console.error(error);
        return null;
    }
}