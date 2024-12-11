import { Reservation } from "../entities/Reservation";
import { User } from "../entities/User";

export interface IReservationRequest {
    user_id: number;
    coworking_id: number;
    waktu_mulai: Date;
    waktu_selesai: Date;
}

export default interface IReservationServices {
    create(data: IReservationRequest): Promise<Reservation>;
    getReservationsByUser(user_id: number): Promise<Reservation[]>;
    verifikasiPembayaran(reservation_id: number): Promise<Reservation>;
    batalkanReservasi(reservation_id: number): Promise<void>;
    updateReservasi(reservation_id: number, user_id: number): Promise<void>;
    getAvailableReservationRooms(waktu_mulai: Date, waktu_selesai: Date): Promise<any>;
    
    // Tambahkan method untuk admin
    getAllReservations(): Promise<Reservation[]>;
    getAllReservationsUser(user_id: number): Promise<Reservation[]>;
    getPendingReservations(): Promise<Reservation[]>;
    updateStatusReservasi(
        reservation_id: number,
        status: string,
    ): Promise<Reservation>;
    getDashboardStats(): Promise<{
        totalReservasi: number;
        reservasiHariIni: number;
        menungguPembayaran: number;
        reservasiAktif: number;
    }>;
    deleteReservation(reservationId: number): Promise<void>;
} 