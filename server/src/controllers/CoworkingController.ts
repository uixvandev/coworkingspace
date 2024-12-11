import { Request, Response } from "express";
import ICoworkingServices from "../services/ICoworkingServices";
import { User } from "../entities/User";

class CoworkingController {
    async getAllRooms(req: Request, res: Response, coworkingServices: ICoworkingServices) {
        try {
            const rooms = await coworkingServices.getAllRooms();
            return res.status(200).json(rooms);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getRoomById(req: Request, res: Response, coworkingServices: ICoworkingServices) {
        try {
            const coworking_id = Number(req.params.coworking_id);
            const room = await coworkingServices.getRoomById(coworking_id);
            return res.status(200).json(room);
        } catch (error: any) {
            return res.status(404).json({ message: error.message });
        }
    }

    async createRoom(req: Request, res: Response, coworkingServices: ICoworkingServices) {
        try {
            const { no_ruang, status_ruang } = req.body;
            
            const user = req.user as User;
            if (!user || !user.user_id) {
                return res.status(401).json({ message: "User ID tidak ditemukan" });
            }

            const room = await coworkingServices.createRoom({
                no_ruang,
                id_admin: user.user_id,
                status_ruang
            });
            return res.status(201).json(room);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async updateRoom(req: Request, res: Response, coworkingServices: ICoworkingServices) {
        try {
            const coworking_id = Number(req.params.coworking_id);
            const { no_ruang, status_ruang } = req.body;

            const room = await coworkingServices.updateRoom(coworking_id, {
                no_ruang,
                status_ruang
            });
            return res.status(200).json(room);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async deleteRoom(req: Request, res: Response, coworkingServices: ICoworkingServices) {
        try {
            const coworking_id = Number(req.params.coworking_id);
            await coworkingServices.deleteRoom(coworking_id);
            return res.status(200).json({ message: "Ruangan berhasil dihapus" });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async updateRoomStatus(req: Request, res: Response, coworkingServices: ICoworkingServices) {
        try {
            const coworking_id = Number(req.params.coworking_id);
            const { status } = req.body;

            const room = await coworkingServices.updateRoomStatus(coworking_id, status);
            return res.status(200).json(room);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async getAvailableRooms(req: Request, res: Response, coworkingServices: ICoworkingServices) {
        try {
            // Remove any parameter dependencies since we just want all available rooms
            const rooms = await coworkingServices.getAvailableRooms();
            return res.status(200).json(rooms);
        } catch (error: any) {
            console.error('Controller error:', error);
            return res.status(500).json({ message: error.message });
        }
    }
}

const coworkingController = new CoworkingController();
export default coworkingController; 