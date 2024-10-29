// jwtMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { findUserType } from '../services/user';

// Secret key for JWT
const jwtSecret = 'secretkey';

// Middleware for verifying JWT token
export const verifyTokenMiddleware = (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = (decoded as any).userId; // Store user ID in locals
        req.token = token;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

export const verifyAdminMiddleware = async (req: any, res: Response, next: NextFunction) => {

    try {
        const userId = req.userId;

        const user = await findUserType(userId)

        console.log({ user });

        if (user?.userType !== "admin") {
            return res.status(401).json({ message: 'Access denied' });
        }


        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};