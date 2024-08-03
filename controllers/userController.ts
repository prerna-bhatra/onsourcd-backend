import { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcryptjs';
// import generateToken from '../utils/generateToken';
import jwt from 'jsonwebtoken';
import { sendResetPasswodOtp, sendVerificationEmail } from '../utills/emailService';
import Otp from '../models/Otp';


export const registerUser = async (req: Request, res: Response) => {
    const { name, email, phone, password, userType } = req.body;

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
                userType: user.userType
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

        console.log({ user, password });


        if (user && (await bcrypt.compare(password, user.password))) {
            console.log({ password });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                isVerifiedEmail: user.isVerifiedEmail,
                isVerifiedPhone: user.isVerifiedPhone,
                userType: user.userType,
                token: jwt.sign({ userId: user._id, name: user.name }, "secretkey", {
                    expiresIn: '30d',
                }),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }

    } catch (error) {
        console.log({ error });

        res.status(500).json({ message: 'Server error', error });
    }
};

export const sendVerifyUserEmail = async (req: any, res: Response) => {
    try {

        const { userId, token } = req;

        const user: any = await User.findOne({ _id: userId })

        const sendEmail = await sendVerificationEmail(token, user?.email)
        if (sendEmail) {
            res.status(200).json({ message: 'Email sent succefully' });
        }
        else {
            res.status(500).json({ message: 'Email sent failed' });

        }

    } catch (error) {
        throw error
    }
}

export const verifyUserEmail = async (req: any, res: Response) => {
    try {

        const { userId } = req;
        const verifyEmail = await User.findByIdAndUpdate(userId, { isVerifiedEmail: true }, { new: true });

        if (verifyEmail) {
            res.status(200).json({ message: 'Verified Succefully' });

        }
        else {
            res.status(500).json({ message: 'Server error' });

        }

    } catch (error) {
        throw error
    }
}

export const sendOtp = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const userExists = await User.findOne({ email });
        if (!userExists) {
            return res.status(400).json({ message: 'User not found' });
        }
        const generatedOtp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        const existingOtp = await Otp.findOne({ email });
        if (existingOtp) {
            existingOtp.otp = generatedOtp;
            await existingOtp.save();
        } else {
            const newOtp = new Otp({
                email,
                otp: generatedOtp
            });
            await newOtp.save();
        }
        const sendEmail = await sendResetPasswodOtp(generatedOtp, email);
        if (sendEmail) {
            res.status(200).json({ message: 'OTP has been sent' });
        }
        else {
            res.status(401).json({ message: 'OTP send failed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        const savedOtp: any = await Otp.findOne({ email })
        console.log({ savedOtp });

        if (savedOtp?.otp === parseInt(otp)) {
            res.status(200).json({ message: 'OTP verified succefully' });
        }
        else {
            res.status(401).json({ message: 'OTP not matched' });

        }


    } catch (error) {
        console.log({ error });

    }
}

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { password, email } = req.body;

        if (!password || !email) {
            return res.status(400).json({ message: 'Password and email are required' });
        }
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const sellerList = async (req: Request, res: Response) => {
    try {
        const users = await User.find({ userType: 'seller' });
        res.status(200).json(users);

    } catch (error) {
        console.log({ error });

        res.status(500).json({ message: 'Server error', error });
    }
};

export const buyerList = async (req: Request, res: Response) => {
    try {
        const users = await User.find({ userType: 'buyer' });
        res.status(200).json(users);

    } catch (error) {
        console.log({ error });

        res.status(500).json({ message: 'Server error', error });
    }
};


