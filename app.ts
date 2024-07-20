import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import userAddressRoutes from './routes/userAddressRoutes';
import productRoutes from './routes/productRoutes';
import requirmentRoutes from './routes/requirmentRoutes';
import quotationRoutes from './routes/quotationRoutes';
import companyRoutes from './routes/companyRoutes';



import cors from 'cors';
import { sendVerificationEmail } from './utills/emailService';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/address', userAddressRoutes);
app.use('/api/products', productRoutes);
app.use('/api/requirments', requirmentRoutes);
app.use('/api/quotation', quotationRoutes);
app.use('/api/company', companyRoutes);



// sendVerificationEmail("","")

mongoose.connect("mongodb+srv://alok1993:cV7GOXVnzuYmrEWf@cluster0.kzdim.mongodb.net/onsourcd", {})
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(error => console.log(`MongoDB connection error: ${error.message}`));
