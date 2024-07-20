import { Request, Response } from 'express';
import Company from '../models/companyModel';


export const registerCompany = async (req: any, res: Response) => {
    const {
        companyAddresss,
        companyName,
        gst,
        latitude,
        longitude,
        googleAddress,
        Occupation
    } = req.body;

    const userId = req.userId;

    try {
        const company = await Company.create({
            userId,
            companyAddresss,
            companyName,
            gst,
            latitude,
            longitude,
            googleAddress,
            Occupation
        });

        if (company) {
            res.status(201).json({
                company
            });
        } else {
            res.status(400).json({ message: 'Invalid Category data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const CompanybyUser = async (req: any, res: Response) => {
    const userId = req.userId;
    try {
        const company = await Company.findOne({ userId });

        res.status(201).json({
            company
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


export const CompanybyId = async (req: any, res: Response) => {
    const { companyID } = req.query;
    try {
        const company = await Company.findOne({ _id: companyID });

        res.status(201).json({
            company
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};