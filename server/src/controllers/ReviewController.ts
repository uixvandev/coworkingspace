import { Request, Response } from "express";
import { IReviewServices } from "../services/IReviewServices";

class ReviewController {
    async createReview(req: Request, res: Response, reviewServices: IReviewServices) {
        try {
            const result = await reviewServices.createReview(req.body);
            return res.status(201).json(result);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async getReviewsByRoom(req: Request, res: Response, reviewServices: IReviewServices) {
        try {
            const coworking_id = Number(req.params.coworking_id);
            const reviews = await reviewServices.getReviewsByRoom(coworking_id);
            return res.status(200).json(reviews);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}


const reviewControllers = new ReviewController();
export default reviewControllers;
