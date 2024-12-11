import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/UserRepository";
import { User } from "../entities/User";

type JwtPayload = {
    user_id: number;
}

const jwtPass = process.env.JWT_PASS as string;

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json('Not authorized');
        }

        const token = authorization.split(' ')[1];
        const { user_id } = jwt.verify(token, jwtPass) as JwtPayload;
        const user = await userRepository.findOneBy({ user_id });
        
        if (!user) {
            return res.status(401).json('Not authorized');
        }

        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword as User;
        
        next();
    } catch (error) {
        return res.status(401).json(error);
    }
}