import { Request, Response } from 'express';
import Category from '../models/categoryModel';
import SubCategory from '../models/subCategoryModel';
import Product from '../models/productModel';
import uploadFileToS3 from "../utills/s3Uploader"
import * as formidable from 'formidable';



export const registerCategory = async (req: Request, res: Response) => {
    const { name } = req.body;

    try {
        const categoryExists = await Category.findOne({ name });

        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await Category.create({
            name,
        });

        if (category) {
            res.status(201).json({
                category
            });
        } else {
            res.status(400).json({ message: 'Invalid Category data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


export const fetchCategories = async (req: Request, res: Response) => {
    const { name } = req.body;

    try {
        const categoryExists = await Category.findOne({ name });

        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const categories = await Category.find();

        if (categories) {
            res.status(201).json({
                categories
            });
        } else {
            res.status(400).json({ message: 'Invalid Category data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


export const registerSubCategory = async (req: Request, res: Response) => {
    const { name, categoryId } = req.body;

    try {
        const subCategoryExists = await Category.findOne({ name, category: categoryId });

        if (subCategoryExists) {
            return res.status(400).json({ message: 'Sub category  can not be created duplicate' });
        }

        const newSubCategory = new SubCategory({
            name,
            category: categoryId
        })

        const saveNewSubcategory = await newSubCategory.save();

        if (saveNewSubcategory) {
            res.status(201).json({
                saveNewSubcategory
            });
        } else {
            res.status(400).json({ message: 'Invalid Sub Category data' });
        }


    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const fetchSubCategoriesByCategoryId = async (req: Request, res: Response) => {
    const { categoryId } = req.body;

    try {
        const subCategories = await Category.find({ category: categoryId });

        if (subCategories) {
            res.status(201).json({
                subCategories
            });
        } else {
            res.status(400).json({ message: 'Invalid Sub Category data' });
        }


    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


export const addProduct = async (req: Request, res: Response) => {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err: any, fields: any, files: any) => {
            if (err) {
                return res.status(400).json({
                    error: 'Image could not be uploaded'
                });
            }

            console.log({ fields });


            const name = fields.name[0];
            const category = fields.categoryId[0];
            const subCategory = fields.subcategoryId[0];

            const gst = fields.gst[0];

            if (files.document) {
                const fileLocation = await uploadFileToS3(files.document[0]);
                console.log({ fileLocation });
                if (fileLocation) {

                    const newProduct = new Product({
                        image: fileLocation,
                        name,
                        category,
                        subCategory,
                        gst
                    })

                    const saveProduct = await newProduct.save()
                    res.status(200).json({
                        message: 'Product Saved',
                        saveProduct
                    });
                }
            } else {
                res.status(400).json({
                    error: 'No document uploaded'
                });
            }
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            message: 'Product Saved',
            products
        });

    } catch (error) {

    }
}
