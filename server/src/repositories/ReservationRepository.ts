import { AppDataSource } from "../data-source";
import { Reservation } from "../entities/Reservation";

export const reservationRepository = AppDataSource.getRepository(Reservation); 