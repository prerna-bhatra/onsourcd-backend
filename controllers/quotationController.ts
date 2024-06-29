// controllers/quotationController.ts
import { Request, Response } from 'express';
import Quotation from '../models/quotationMode';

// Add new Quotation
export const addQuotation = async (req: any, res: Response) => {
    try {
        const userId = req.userId;

        const {
            requirementId,
            estimatedPrice,
            gst,
            qualityDescription,
            transportAvailability
        } = req.body;

        const quotation = new Quotation({
            requirementId,
            estimatedPrice,
            sellerId: userId,
            gst,
            qualityDescription,
            transportAvailability
        });
        await quotation.save();
        res.status(201).send(quotation);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Fetch by Requirement ID
export const getQuotationsByRequirementId = async (req: Request, res: Response) => {
    try {
        const quotations = await Quotation.find({ requirementId: req.params.requirementId });
        if (!quotations) {
            return res.status(404).send();
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
            return res.status(404).send();
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
            return res.status(404).send();
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

export const updateQuotationStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!['rejected', 'accepted', 'pending'].includes(status)) {
            return res.status(400).send({ error: 'Invalid status' });
        }

        const quotation = await Quotation.findByIdAndUpdate(
            id,
            { status: "accepted" },
            { new: true, runValidators: true }
        );

        console.log({ quotation })

        const rejectQuotation = await Quotation.updateMany({
            requirementId: quotation?.requirementId,
            _id: { $ne: id } // Exclude the current quotation
        }, {
            status: "rejected"
        });


        console.log({ rejectQuotation });


        if (!quotation) {
            return res.status(404).send();
        }

        res.send(quotation);
    } catch (error) {
        res.status(400).send(error);
    }
};
