import express from 'express';
import { registerCompany , CompanybyId , CompanybyUser } from '../controllers/companyController';
import { verifyTokenMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register',verifyTokenMiddleware, registerCompany);
router.get('/',verifyTokenMiddleware, CompanybyId);
router.get('/details',verifyTokenMiddleware, CompanybyUser);

export default router;
