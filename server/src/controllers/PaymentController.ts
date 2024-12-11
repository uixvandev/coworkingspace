import { Request, Response } from "express";
import IPaymentServices from "../services/IPaymentServices";
import { User } from "../entities/User";

class PaymentController {
    async getAllPayments(req: Request, res: Response, paymentServices: IPaymentServices) {
        try {
            const payments = await paymentServices.getAllPayments();
            return res.status(200).json(payments);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getPendingPayments(req: Request, res: Response, paymentServices: IPaymentServices) {
        try {
            const payments = await paymentServices.getPendingPayments();
            return res.status(200).json(payments);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async verifyPayment(req: Request, res: Response, paymentServices: IPaymentServices) {
        try {
            const payment_id = Number(req.params.payment_id);
            
            const user = req.user as User;
            if (!user || !user.user_id) {
                return res.status(401).json({ message: "User ID tidak ditemukan" });
            }

            const payment = await paymentServices.verifyPayment(payment_id, user.user_id);
            return res.status(200).json(payment);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async rejectPayment(req: Request, res: Response, paymentServices: IPaymentServices) {
        try {
            const payment_id = Number(req.params.payment_id);
            
            const user = req.user as User;
            if (!user || !user.user_id) {
                return res.status(401).json({ message: "User ID tidak ditemukan" });
            }

            const payment = await paymentServices.rejectPayment(payment_id, user.user_id);
            return res.status(200).json(payment);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async getPaymentStats(req: Request, res: Response, paymentServices: IPaymentServices) {
        try {
            const stats = await paymentServices.getPaymentStats();
            return res.status(200).json(stats);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}

const paymentController = new PaymentController();
export default paymentController; 