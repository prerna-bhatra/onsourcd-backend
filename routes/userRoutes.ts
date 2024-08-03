import express from 'express';
import { registerUser, loginUser, sendVerifyUserEmail, verifyUserEmail, sellerList, buyerList, sendOtp, verifyOtp, resetPassword } from '../controllers/userController';
import { verifyTokenMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/send-verify-email', verifyTokenMiddleware, sendVerifyUserEmail);
router.get('/verify-email', verifyTokenMiddleware, verifyUserEmail);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);



router.get('/sellers', sellerList);
router.get('/buyers', buyerList);

export default router;
