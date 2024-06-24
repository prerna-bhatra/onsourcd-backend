import express from 'express';
import { registerRequirement, getRequirements, requirementByUserId } from '../controllers/requirementController';
import { verifyAdminMiddleware, verifyTokenMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', verifyTokenMiddleware, registerRequirement);
router.get('/my-requirements', verifyTokenMiddleware, requirementByUserId);

router.get('/', verifyTokenMiddleware, getRequirements);


export default router;
