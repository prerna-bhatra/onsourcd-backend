import express from 'express';
import { addUserAddress, getUserAddressByUserId } from '../controllers/userAddressController';

const router = express.Router();

router.post('/', addUserAddress);
router.post('/', getUserAddressByUserId);


export default router;
