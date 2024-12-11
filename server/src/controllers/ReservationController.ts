import { Request, Response } from "express";
import IReservationServices from "../services/IReservationServices";
import { User } from "../entities/User";

class ReservationController {
    async create(req: Request, res: Response, reservationServices: IReservationServices) {
        try {
            const { user_id, coworking_id, waktu_mulai, waktu_selesai } = req.body;
            const result = await reservationServices.create({
                user_id,
                coworking_id,
                waktu_mulai: new Date(waktu_mulai),
                waktu_selesai: new Date(waktu_selesai)
            });
            return res.status(201).json(result);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async getReservationsByUser(req: Request, res: Response, reservationServices: IReservationServices) {
        try {
            const user_id = Number(req.params.user_id);
            const reservations = await reservationServices.getReservationsByUser(user_id);
            return res.status(200).json(reservations);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async verifikasiPembayaran(req: Request, res: Response, reservationServices: IReservationServices) {
        try {
            const reservation_id = Number(req.params.reservation_id);
            const result = await reservationServices.verifikasiPembayaran(reservation_id);
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async batalkanReservasi(req: Request, res: Response, reservationServices: IReservationServices) {
        try {
            const reservation_id = Number(req.params.reservation_id);
            await reservationServices.batalkanReservasi(reservation_id);
            return res.status(200).json({ message: "Reservasi berhasil dibatalkan" });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async updateReservasi(req: Request, res: Response, reservationServices: IReservationServices) {
        try {
            const { user_id, reservation_id } = req.body;
            await reservationServices.updateReservasi(reservation_id, user_id);
            return res.status(200).json({ message: "Reservasi berhasil dibatalkan" });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async getAvailableReservationRooms(req: Request, res: Response, reservationServices: IReservationServices) {
        try {
            const { waktu_mulai, waktu_selesai } = req.query;
            const availableRooms = await reservationServices.getAvailableReservationRooms(
                new Date(waktu_mulai as string),
                new Date(waktu_selesai as string)
            );
            return res.status(200).json(availableRooms);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getAllReservations(req: Request, res: Response, reservationServices: IReservationServices) {
        try {
            const reservations = await reservationServices.getAllReservations();
            return res.status(200).json(reservations);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getAllReservationsUser(req: Request, res: Response, reservationServices: IReservationServices) {
        try {
            const user_id = Number(req.params.user_id);
            const reservations = await reservationServices.getAllReservationsUser(user_id);
            return res.status(200).json(reservations);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getPendingReservations(req: Request, res: Response, reservationServices: IReservationServices) {
        try {
            const reservations = await reservationServices.getPendingReservations();
            return res.status(200).json(reservations);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async updateStatusReservasi(req: Request, res: Response, reservationServices: IReservationServices) {
        try {
            const reservation_id = Number(req.params.reservation_id);
            const { status } = req.body;
    

            const result = await reservationServices.updateStatusReservasi(
                reservation_id,
                status,
            );
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async getDashboardStats(req: Request, res: Response, reservationServices: IReservationServices) {
        try {
            const stats = await reservationServices.getDashboardStats();
            return res.status(200).json(stats);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
    async deleteReservation(req: Request, res: Response, reservationServices: IReservationServices) {
        try {
            const reservationId = Number(req.params.id);
            await reservationServices.deleteReservation(reservationId);
            return res.status(200).json({ message: "reservation berhasil dihapus" });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }
}

const reservationController = new ReservationController();
export default reservationController; 