// routes/quotationRoutes.ts
import express from 'express';
import { 
    addQuotation,
    getQuotationsByRequirementId,
    getQuotationsBySellerId,
    getQuotationById,
    getAllQuotations,
    getQuotationsByRequirementIdAndUserID,
    updateQuotationStatus,
    getOrdersByRequirement
} from '../controllers/quotationController';
import { verifyTokenMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/:requirementId',verifyTokenMiddleware, addQuotation);
router.get('/requirement/:requirementId',verifyTokenMiddleware , getQuotationsByRequirementId);
router.get('/user-requirement/:requirementId',verifyTokenMiddleware , getQuotationsByRequirementIdAndUserID);
router.get('/seller',verifyTokenMiddleware ,  getQuotationsBySellerId);
router.get('/:id', verifyTokenMiddleware, getQuotationById);
router.get('/', getAllQuotations);

router.get('/accept-order/:id', verifyTokenMiddleware ,updateQuotationStatus);
router.get('/requirement-orders/:id', verifyTokenMiddleware ,getOrdersByRequirement);


export default router;
