import express from 'express';
import { registerUser, loginUser, sendVerifyUserEmail, verifyUserEmail, sellerList, buyerList } from '../controllers/userController';
import { verifyTokenMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/send-verify-email',verifyTokenMiddleware, sendVerifyUserEmail);
router.get('/verify-email',verifyTokenMiddleware, verifyUserEmail);


router.get('/sellers', sellerList);
router.get('/buyers', buyerList);

export default router;
