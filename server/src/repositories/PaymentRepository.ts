import { AppDataSource } from "../data-source";
import { Payment } from "../entities/Payment";

export const paymentRepository = AppDataSource.getRepository(Payment); 