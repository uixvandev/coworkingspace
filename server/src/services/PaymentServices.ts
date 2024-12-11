import { Payment } from "../entities/Payment";
import { paymentRepository } from "../repositories/PaymentRepository";
import { reservationRepository } from "../repositories/ReservationRepository";
import IPaymentServices, { IPaymentRequest } from "./IPaymentServices";
import notificationServices from "./NotificationServices";
import { Between } from "typeorm";

class PaymentServices implements IPaymentServices {
    async createPayment(data: IPaymentRequest): Promise<Payment> {
        const payment = paymentRepository.create({
            ...data,
            waktu_pembayaran: new Date(),
            status_pembayaran: 'pending'
        });
        
        return await paymentRepository.save(payment);
    }

    async getAllPayments(): Promise<Payment[]> {
        return await paymentRepository.find({
            relations: ['reservation', 'reservation.user'],
            order: { waktu_pembayaran: 'DESC' }
        });
    }

    async getPaymentById(payment_id: number): Promise<Payment> {
        const payment = await paymentRepository.findOne({
            where: { payment_id },
            relations: ['reservation', 'reservation.user']
        });
        
        if (!payment) {
            throw new Error("Pembayaran tidak ditemukan");
        }
        
        return payment;
    }

    async getPaymentsByReservation(reservation_id: number): Promise<Payment[]> {
        return await paymentRepository.find({
            where: { reservation_id },
            order: { waktu_pembayaran: 'DESC' }
        });
    }

    async getPendingPayments(): Promise<Payment[]> {
        return await paymentRepository.find({
            where: { status_pembayaran: 'pending' },
            relations: ['reservation', 'reservation.user'],
            order: { waktu_pembayaran: 'ASC' }
        });
    }

    async verifyPayment(payment_id: number, admin_id: number): Promise<Payment> {
        const payment = await this.getPaymentById(payment_id);
        const reservation = await reservationRepository.findOne({
            where: { reservation_id: payment.reservation_id },
            relations: ['user']
        });

        if (!reservation) {
            throw new Error("Reservasi tidak ditemukan");
        }

        payment.status_pembayaran = 'verified';
        await paymentRepository.save(payment);

        // Update status reservasi
        reservation.status_reservasi = 'aktif';
        await reservationRepository.save(reservation);

        // Kirim notifikasi ke user
        await notificationServices.createNotification({
            user_id: reservation.user.user_id,
            judul: "Pembayaran Diverifikasi",
            pesan: `Pembayaran untuk reservasi #${reservation.reservation_id} telah diverifikasi`,
            tipe: "payment_verified"
        });

        return payment;
    }

    async rejectPayment(payment_id: number, admin_id: number): Promise<Payment> {
        const payment = await this.getPaymentById(payment_id);
        const reservation = await reservationRepository.findOne({
            where: { reservation_id: payment.reservation_id },
            relations: ['user']
        });

        if (!reservation) {
            throw new Error("Reservasi tidak ditemukan");
        }

        payment.status_pembayaran = 'rejected';
        await paymentRepository.save(payment);

        // Kirim notifikasi ke user
        await notificationServices.createNotification({
            user_id: reservation.user.user_id,
            judul: "Pembayaran Ditolak",
            pesan: `Pembayaran untuk reservasi #${reservation.reservation_id} ditolak. Silakan lakukan pembayaran ulang.`,
            tipe: "payment_rejected"
        });

        return payment;
    }

    async getPaymentStats(): Promise<any> {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const [
            totalPembayaran,
            pembayaranHariIni,
            pembayaranPending,
            pembayaranVerified
        ] = await Promise.all([
            paymentRepository.count(),
            paymentRepository.count({
                where: {
                    waktu_pembayaran: Between(startOfDay, endOfDay)
                }
            }),
            paymentRepository.count({
                where: { status_pembayaran: 'pending' }
            }),
            paymentRepository.count({
                where: { status_pembayaran: 'verified' }
            })
        ]);

        return {
            totalPembayaran,
            pembayaranHariIni,
            pembayaranPending,
            pembayaranVerified
        };
    }
}

const paymentServices = new PaymentServices();
export default paymentServices; 