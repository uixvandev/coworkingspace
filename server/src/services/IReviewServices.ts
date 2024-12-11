import { Review } from "../entities/Review";

export interface IReviewRequest {
    coworking_id: number;
    reservation_id: number;
    komentar: string;
}

export interface IReviewServices {
    createReview(data: IReviewRequest): Promise<Review>;
    getReviewsByRoom(coworking_id: number): Promise<Review[]>;
}
