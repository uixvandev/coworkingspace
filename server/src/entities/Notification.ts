import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity('notification')
export class Notification {
    @PrimaryGeneratedColumn()
    notification_id: number

    @Column({ type: 'integer', nullable: false })
    user_id: number

    @Column({ type: 'text', nullable: false })
    judul: string

    @Column({ type: 'text', nullable: false })
    pesan: string

    @Column({ type: 'text', nullable: false })
    tipe: string // misalnya: 'reservasi', 'pembayaran', 'review', dll

    @Column({ type: 'boolean', default: false })
    dibaca: boolean

    @CreateDateColumn()
    waktu_notifikasi: Date
} 