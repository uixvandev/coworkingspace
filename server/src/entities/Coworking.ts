import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Reservation } from './Reservation'; // Import entitas Reservation


@Entity('coworking')
export class Coworking {
    @PrimaryGeneratedColumn()
    coworking_id: number

    @Column({ type: 'text', nullable: false })
    no_ruang: string

    @Column({ type: 'integer', nullable: false })
    id_admin: number

    @Column({ type: 'text', nullable: false })
    status_ruang: string

    @ManyToOne(() => User)
    @JoinColumn({ name: 'id_admin' })
    admin: User;

    @OneToMany(() => Reservation, (reservation) => reservation.coworking)
    reservations: Reservation[]; // Relasi satu ke banyak dengan Reservation
} 




