import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Coworking } from "./Coworking"; // Import entitas Coworking
import { Review } from "./Review";

@Entity('reservation')
export class Reservation {
    @PrimaryGeneratedColumn()
    reservation_id: number;

    @Column({ type: 'integer', nullable: true })
    user_id: number;

    @Column({ type: 'integer', nullable: false })
    coworking_id: number;

    @Column({ type: 'timestamp', nullable: false })
    waktu_mulai: Date;

    @Column({ type: 'timestamp', nullable: false })
    waktu_selesai: Date;

    @Column({ type: 'text', nullable: false })
    status_reservasi: string;

    // Relasi ke entitas User
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    // Relasi ke entitas Coworking
    @ManyToOne(() => Coworking)
    @JoinColumn({ name: 'coworking_id' })
    coworking: Coworking; // Properti baru yang berisi data Coworking

    // Relasi ke Review
    @OneToMany(() => Review, (review) => review.reservation)
    reviews: Review[]; // Properti untuk menyimpan banyak review terkait reservasi
}
