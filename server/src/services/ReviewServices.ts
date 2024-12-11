import { Review } from "../entities/Review";
import { reviewRepository } from "../repositories/ReviewRepository";
import { IReviewRequest, IReviewServices } from "./IReviewServices";

class ReviewServices implements IReviewServices {
  

    async createReview(data: IReviewRequest): Promise<Review> {
        // Cek apakah review untuk user dan coworking sudah ada
        let review = await reviewRepository.findOne({
            where: {
               reservation_id: data.reservation_id,
            }
        });
    
        if (review) {
         
            review.komentar = data.komentar;
            review.tanggal_review = new Date();  // Memperbarui tanggal review
    
            // Simpan perubahan
            return await reviewRepository.save(review);
        } else {
            // Jika belum ada, buat review baru
            review = reviewRepository.create({
                ...data,
                tanggal_review: new Date()  // Menambahkan tanggal review
            });
    
            // Simpan review baru
            return await reviewRepository.save(review);
        }
    }
    
    async getReviewsByRoom(reservation_id: number): Promise<Review[]> {
        return await reviewRepository.find({
            where: { reservation_id },
            order: { tanggal_review: 'DESC' }
        });
    }
}



const reviewServices = new ReviewServices();
export default reviewServices;