import { NextFunction, Request, Response } from "express";

export const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Akses ditolak. Hanya admin yang diizinkan.' });
        }
        next();
    } catch (error) {
        return res.status(401).json(error);
    }
} 