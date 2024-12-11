import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Reservation } from "./Reservation";

@Entity('review')
export class Review {
    @PrimaryGeneratedColumn()
    review_id: number;

    @Column({ type: 'integer', nullable: false })
    reservation_id: number;

    @Column({ type: 'text', nullable: true })
    komentar: string;

    @Column({ type: 'date', nullable: false })
    tanggal_review: Date;

    // Relasi ke Reservation
    @ManyToOne(() => Reservation, (reservation) => reservation.reviews)
    @JoinColumn({ name: 'reservation_id' })
    reservation: Reservation; // Properti untuk relasi ke Reservation
}
