import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    user_id: number

    @Column({ type: 'text', nullable: false })
    nama: string 

    @Column({ type: 'text', nullable: false, unique: true })
    email: string

    @Column({ type: 'text', nullable: false })
    password: string

    @Column({ type: 'date', nullable: false })
    tanggal_daftar: Date

    @Column({ type: 'text', nullable: true })
    no_telp: string

    @Column({ type: 'text', nullable: false })
    role: string

    @CreateDateColumn()
    created_at: Date

    @CreateDateColumn()
    updated_at: Date
}
