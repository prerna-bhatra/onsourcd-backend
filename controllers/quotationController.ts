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
            transportAvailability,
            transportationPrice
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
            transportAvailability,
            transportationPrice
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


export const getOrdersByQuotation = async (req: any, res: any) => {
    try {
        const { id } = req.params
        const orders = await Order.find({ quotationId: new Types.ObjectId(id) });
        res.status(201).send(orders);
        return orders;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getAllOrders = async (req: any, res: any) => {
    try {
        const orders = await Order.find().
            populate('sellerId', 'name email phone ')
            .populate('buyerId', 'name email phone')
            .populate('productId', 'name  image')
            .populate('requirementId', 'deliveryAddress  deliveryCity deliveryState  deliveryZipCode');

        console.log({ orders });


        // console.log({ orders });
        res.status(200).send(orders);
        return orders;
    } catch (error) {
        console.error("error in all order", { error });
        return null;
    }
}

export const getOrdersBySeller = async (req: Request, res: Response) => {
    try {
        const { sellerId } = req.params;

        console.log({ sellerId });

        const orders = await Order.find({
            sellerId: new Types.ObjectId(sellerId),
            paymentProgress: 'received'
        }).populate({
            path: 'productId',
            select: 'name image'
        });;

        console.log({ orders });

        res.status(200).send(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

export const updateOrderPaymentProgress = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        console.log({ body: req.body });

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { paymentProgress: 'received' },
            { new: true }
        );

        if (!updatedOrder) {
            res.status(404).send('Order not found');
            return;
        }

        res.status(200).send(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;

        console.log({ body: req.body });

        const { status } = req.body;

        console.log({ status });


        // either status dispatched , deleivered , received  

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: status },
            { new: true } // This option returns the updated document
        );

        if (!updatedOrder) {
            res.status(404).send('Order not found');
            return;
        }

        res.status(200).send(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


export const getOrdersByBuyer = async (req: Request, res: Response) => {
    try {
        console.log("getOrdersByBuyer");

        const { buyerId } = req.params;

        console.log({ buyerId });

        const orders = await Order.find({
            buyerId: new Types.ObjectId(buyerId),
            // paymentProgress: 'received'
        }).populate({
            path: 'productId',
            select: 'name image'
        });;

        console.log({ orders });

        res.status(200).send(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


export const getOrdersDashboard = async (req: Request, res: Response) => {
    try {
        console.log("getOrdersDashboard");

        const pendingorders = await Order.countDocuments({ status: "pending" })

        const completedOrders = await Order.countDocuments({ status: "delivered" })

        const quotationPending = await Quotation.countDocuments({ status: "pending" })

        const quotationAccepted = await Quotation.countDocuments({ status: "accepted" })

        const quotationRejected = await Quotation.countDocuments({ status: "rejected" })


        res.status(200).send({
            pendingorders,
            quotationPending,
            completedOrders,
            quotationAccepted,
            quotationRejected
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


export const getOrdersDashboardForSellers = async (req: any, res: Response) => {
    try {
        console.log("getOrdersDashboardForSellers");
        const userId = req.userId;
        const { userType } = req.query
        console.log("getOrdersDashboardForSellers", userId, userType);

        let pendingorders , completedOrders , quotationPending ,quotationAccepted;
        if (userType === "seller") {
            pendingorders = await Order.find({ status: "pending", sellerId: new Types.ObjectId(userId) })
            completedOrders = await Order.find({ status: "delivered",sellerId: new Types.ObjectId(userId) })
            quotationPending= await Quotation.find({ status: "pending",sellerId: new Types.ObjectId(userId)  })
            quotationAccepted= await Quotation.find({ status: "rejected",sellerId: new Types.ObjectId(userId)  })
        }
        else {
            pendingorders = await Order.find({ status: "pending", sellerId: new Types.ObjectId(userId) })
            completedOrders = await Order.find({ status: "delivered",sellerId: new Types.ObjectId(userId) })
            quotationPending= await Quotation.find({ status: "pending",sellerId: new Types.ObjectId(userId)  })
            quotationAccepted= await Quotation.find({ status: "rejected",sellerId: new Types.ObjectId(userId)  })
        
        }


        res.status(200).send({
            pendingorders,
            completedOrders,
            quotationPending,
            quotationAccepted
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};