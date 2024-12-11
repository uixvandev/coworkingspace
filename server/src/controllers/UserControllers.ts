import { Request, Response } from "express";
import IUserServices from "../services/IUserServices";

import path from "path";

class UserControllers {

    async create(req: Request, res: Response, userServices: IUserServices) {
        try {
            var { nama, email, password, no_telp, role } = req.body;
            role="user";
            const result = await userServices.save({ nama, email, password, no_telp, role });
            const { password: _, ...user } = result;
            return res.status(201).json(user);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async checkEmail(req: Request, res: Response, userServices: IUserServices) {
        try {
            const email = req.params.email;
            const result = await userServices.checkEmail(email);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json(error);
        }
    }


    async login(req: Request, res: Response, userServices: IUserServices) {
        try {
            const { email, password } = req.body;
            const result = await userServices.login(email, password);
            
            if (!result) {
                return res.status(401).json({ message: 'Email atau Password salah' });
            }

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async getProfile(req: Request, res: Response) {
        try {
            return res.json(req.user);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    async updateProfile(req: Request, res: Response, userServices: IUserServices) {
        try {
            const { user_id, nama, email, no_telp, password } = req.body;
            const result = await userServices.updateProfile(user_id, { 
                nama, 
                email, 
                no_telp,
                password: password || undefined 
            });
            return res.status(200).json({ message: result });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }
    

    async getPassword(req: Request, res: Response, userServices: IUserServices) {
        try {
            const email = req.params.email;
            const result = await userServices.getPassword(email);
            return res.status(200).json({ message: result });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async getAllUsers(req: Request, res: Response, userServices: IUserServices) {
        try {
            const users = await userServices.getAllUsers();
            return res.status(200).json(users);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async createUser(req: Request, res: Response, userServices: IUserServices) {
        try {
            const { nama, email, password, no_telp, role } = req.body;
            const result = await userServices.save({ nama, email, password, no_telp, role });
            const { password: _, ...user } = result;
            return res.status(201).json(user);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async updateUser(req: Request, res: Response, userServices: IUserServices) {
        try {
            const userId = Number(req.params.id);
            const { nama, email, role, no_telp } = req.body;
            const result = await userServices.updateUser(userId, { nama, email, role, no_telp });
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async deleteUser(req: Request, res: Response, userServices: IUserServices) {
        try {
            const userId = Number(req.params.id);
            await userServices.deleteUser(userId);
            return res.status(200).json({ message: "User berhasil dihapus" });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }
}

const userControllers = new UserControllers();
export default userControllers;
