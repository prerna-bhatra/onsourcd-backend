import express from 'express';
import { registerCategory, fetchCategories, registerSubCategory, addProduct, getProducts } from '../controllers/productController';

const router = express.Router();

router.post('/category', registerCategory);
router.post('/subcategory', registerSubCategory);
router.get('/categories', fetchCategories);
router.post('/subcategories', registerSubCategory);
router.post('/', addProduct);
router.get('/', getProducts);


export default router;
