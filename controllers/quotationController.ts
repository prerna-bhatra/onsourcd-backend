// controllers/quotationController.ts
import { Request, Response } from 'express';
import Quotation from '../models/quotationMode';
import Requirement from '../models/requirmentModel';
import { Types } from 'mongoose';


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
            return res.status(404).send();
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



        if (!quotation) {
            return res.status(404).send();
        }

        res.send(quotation);
    } catch (error) {
        res.status(400).send(error);
    }
};
