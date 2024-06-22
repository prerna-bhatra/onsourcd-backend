import express from 'express';
import { addUserAddress } from '../controllers/userAddressController';

const router = express.Router();

router.post('/', addUserAddress);

export default router;
