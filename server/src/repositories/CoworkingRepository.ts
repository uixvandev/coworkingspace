import { AppDataSource } from "../data-source";
import { Coworking } from "../entities/Coworking";

export const coworkingRepository = AppDataSource.getRepository(Coworking); 