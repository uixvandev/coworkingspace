import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Reservation } from "./Reservation";  // Pastikan path ke entitas Reservation benar

@Entity('payment')
export class Payment {
    @PrimaryGeneratedColumn()
    payment_id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    jumlah_pembayaran: number;

    @Column({ type: 'text', nullable: false })
    metode_pembayaran: string;

    @Column({ type: 'timestamp', nullable: false })
    waktu_pembayaran: Date;

    @Column({ type: 'text', nullable: false })
    status_pembayaran: string;

    @Column({ type: 'integer', nullable: false })
    reservation_id: number;


}
