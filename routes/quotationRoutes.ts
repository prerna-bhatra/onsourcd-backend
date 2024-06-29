// routes/quotationRoutes.ts
import express from 'express';
import { 
    addQuotation,
    getQuotationsByRequirementId,
    getQuotationsBySellerId,
    getQuotationById,
    getAllQuotations
} from '../controllers/quotationController';
import { verifyTokenMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', addQuotation);
router.get('/requirement/:requirementId',verifyTokenMiddleware , getQuotationsByRequirementId);
router.get('/seller',verifyTokenMiddleware ,  getQuotationsBySellerId);
router.get('/:id', verifyTokenMiddleware, getQuotationById);
router.get('/', getAllQuotations);

export default router;
