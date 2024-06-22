import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import cors from 'cors';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);


mongoose.connect("mongodb+srv://alok1993:cV7GOXVnzuYmrEWf@cluster0.kzdim.mongodb.net/onsourcd", {})
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(error => console.log(`MongoDB connection error: ${error.message}`));
