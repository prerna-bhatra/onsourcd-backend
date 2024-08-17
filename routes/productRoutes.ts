import express from 'express';
import { registerCategory, fetchCategories, registerSubCategory, addProduct, getProducts, fetchSubCategoriesByCategoryId, deleteProduct, deleteCategory, deleteSubCategory } from '../controllers/productController';
import { verifyTokenMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/category', registerCategory);
router.post('/subcategory', registerSubCategory);
router.get('/categories', fetchCategories);
router.get('/subcategories-by-categoryId', fetchSubCategoriesByCategoryId);
router.post('/', addProduct);
router.get('/', getProducts);

router.get('/delete/:productID', deleteProduct);
router.post('/category', registerCategory);
router.post('/sub-category', registerSubCategory);
router.delete('/category/:id', deleteCategory);
router.delete('/sub-category/:id', deleteSubCategory);


export default router;
