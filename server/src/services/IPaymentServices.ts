import { Payment } from "../entities/Payment";

export interface IPaymentRequest {
    reservation_id: number;
    jumlah_pembayaran: number;
    metode_pembayaran: string;
    status_pembayaran: string;
}

export default interface IPaymentServices {
    createPayment(data: IPaymentRequest): Promise<Payment>;
    getAllPayments(): Promise<Payment[]>;
    getPaymentById(payment_id: number): Promise<Payment>;
    getPaymentsByReservation(reservation_id: number): Promise<Payment[]>;
    getPendingPayments(): Promise<Payment[]>;
    verifyPayment(payment_id: number, admin_id: number): Promise<Payment>;
    rejectPayment(payment_id: number, admin_id: number): Promise<Payment>;
    getPaymentStats(): Promise<any>;
} 