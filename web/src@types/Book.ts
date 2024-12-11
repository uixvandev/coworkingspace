export interface IUpcomingBooking {
    reservation_id: number;
    user_id: number | null;
    coworking: {
        no_ruang: string;
    };
    waktu_mulai: Date;
    waktu_selesai: Date;
    status_reservasi: string;
    review?: {
        review_id: number;
        komentar: string;
        tanggal_review: Date;
    };
}
