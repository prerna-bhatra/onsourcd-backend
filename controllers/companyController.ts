import { Request, Response } from 'express';
import Company from '../models/companyModel';


export const registerCompany = async (req: any, res: Response) => {
    
    const {
        companyAddresss,
        companyName,
        gstNumber,
        latitude,
        longitude,
        googleAddress,
        occupation
    } = req.body;

    const userId = req.userId;


    console.log({
        userId,
        companyAddresss,
        companyName,
        gst:gstNumber,
        latitude,
        longitude,
        googleAddress,
        occupation
    });

    try {
        const company = await Company.create({
            // userId,
            companyAddresss,
            companyName,
            gst:gstNumber,
            latitude,
            longitude,
            googleAddress,
            occupation
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

export const updateCompanyByUserId = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const {
        companyName,
        companyAddresss,
        gst,
        latitude,
        longitude,
        googleAddress,
        Occupation
    } = req.body;

    try {
        const updatedCompany = await Company.findOneAndUpdate(
            { userId },
            {
                companyName,
                companyAddresss,
                gst,
                latitude,
                longitude,
                googleAddress,
                Occupation
            },
            { new: true, runValidators: true } // Returns the updated document
        );

        if (updatedCompany) {
            res.status(200).json({ updatedCompany });
        } else {
            res.status(404).json({ message: 'Company not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
