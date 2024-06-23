import { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcryptjs';
// import generateToken from '../utils/generateToken';
import jwt from 'jsonwebtoken';


export const registerUser = async (req: Request, res: Response) => {
    const { name, email, phone, password , userType } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            userType
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                userType:user.userType
                // isVerifiedEmail: user.isVerifiedEmail,
                // isVerifiedPhone: user.isVerifiedPhone,
                // token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        console.log({user ,password});
        

        if (user && (await bcrypt.compare(password, user.password))) {
            console.log({password});
            
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                isVerifiedEmail: user.isVerifiedEmail,
                isVerifiedPhone: user.isVerifiedPhone,
                token: jwt.sign({ userId: user._id, name: user.name }, "secretkey", {
                    expiresIn: '30d',
                }),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }

    } catch (error) {
        console.log({error});
        
        res.status(500).json({ message: 'Server error', error });
    }
};
