import { AppDataSource } from "../data-source";
import { Review } from "../entities/Review";

export const reviewRepository = AppDataSource.getRepository(Review);
