import express from 'express';
import { registerUser, loginUser, verifyUserEmail } from '../controllers/userController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify', verifyUserEmail);

export default router;
