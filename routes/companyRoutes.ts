import express from 'express';
import { registerCompany , CompanybyId , CompanybyUser, updateCompanyByUserId } from '../controllers/companyController';
import { verifyTokenMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register',verifyTokenMiddleware, registerCompany);
router.get('/',verifyTokenMiddleware, CompanybyId);
router.get('/details',verifyTokenMiddleware, CompanybyUser);
router.post('/update',verifyTokenMiddleware, updateCompanyByUserId);

export default router;
