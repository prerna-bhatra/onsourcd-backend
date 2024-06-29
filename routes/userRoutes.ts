import express from 'express';
import { registerUser, loginUser, verifyUserEmail } from '../controllers/userController';
import { verifyTokenMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify',verifyTokenMiddleware, verifyUserEmail);

export default router;
