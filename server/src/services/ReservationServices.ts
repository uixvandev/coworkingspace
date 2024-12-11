import { Reservation } from "../entities/Reservation";
import { coworkingRepository } from "../repositories/CoworkingRepository";
import { paymentRepository } from "../repositories/PaymentRepository";
import { reservationRepository } from "../repositories/ReservationRepository";
import IReservationServices, { IReservationRequest } from "./IReservationServices";
import notificationServices from "./NotificationServices";
import { Between, In } from "typeorm";

class ReservationServices implements IReservationServices {
    async create(data: IReservationRequest): Promise<Reservation> {
        // Cek ketersediaan ruangan
        
        const reservation = reservationRepository.create({
            ...data,
            status_reservasi: "nonaktif"
        });

        // await notificationServices.createNotification({
        //     user_id: data.user_id,
        //     judul: "Reservasi Baru",
        //     pesan: `Reservasi ruangan berhasil dibuat. Silakan lakukan pembayaran.`,
        //     tipe: "reservasi"
        // });

        return await reservationRepository.save(reservation);
    }

    async getReservationsByUser(user_id: number): Promise<Reservation[]> {
        return await reservationRepository.find({
            where: { user_id },
            relations: ['coworking']
        });
    }

    async verifikasiPembayaran(reservation_id: number): Promise<Reservation> {
        const reservation = await reservationRepository.findOneBy({ reservation_id });
        
        if (!reservation) {
            throw new Error("Reservasi tidak ditemukan");
        }

        reservation.status_reservasi = "aktif";
        await notificationServices.createNotification({
            user_id: reservation.user_id,
            judul: "Pembayaran Terverifikasi",
            pesan: `Pembayaran untuk reservasi #${reservation.reservation_id} telah diverifikasi.`,
            tipe: "pembayaran"
        });
        return await reservationRepository.save(reservation);
    }

    async batalkanReservasi(reservation_id: number): Promise<void> {
        try {
            // Menggunakan QueryBuilder untuk melakukan update langsung di database
            const result = await reservationRepository
                .createQueryBuilder()
                .update(Reservation)  // Tentukan entitas yang akan diupdate
                .set({
                    status_reservasi: "aktif",  
                    user_id: () => "NULL"  // Gunakan SQL "NULL" untuk mengosongkan kolom user_id
                })
                .where("reservation_id = :reservation_id", { reservation_id })  // Menentukan kondisi untuk mencari reservasi berdasarkan reservation_id
                .execute();
            
            // Mengecek jika update berhasil
            if (result.affected === 0) {
                throw new Error("Reservasi tidak ditemukan atau sudah dibatalkan");
            }
            
        } catch (error) {
            // Menangani error, misalnya log error atau lemparkan kembali error dengan pesan yang lebih informatif
            console.error("Terjadi kesalahan saat membatalkan reservasi:", error);
            throw new Error("Gagal membatalkan reservasi, coba lagi nanti.:");
        }
    }
    

    async updateReservasi(reservation_id: number, user_id:number): Promise<void> {
        // Menggunakan QueryBuilder untuk melakukan update langsung di database
        const result = await reservationRepository
            .createQueryBuilder()
            .update(Reservation)  // Tentukan entitas yang akan diupdate
            .set({
                status_reservasi: "nonaktif",  // Set status menjadi nonaktif
                user_id : user_id  // Gunakan SQL "NULL" untuk mengosongkan kolom
            })
            .where("reservation_id = :reservation_id", { reservation_id })  // Menentukan kondisi untuk mencari reservasi berdasarkan reservation_id
            .andWhere("status_reservasi = :status", { status: "aktif" })  // Pastikan hanya yang statusnya aktif yang diupdate
            .execute();
    

        // Mengecek jika update berhasil
        if (result.affected === 0) {
            throw new Error("Reservasi tidak ditemukan atau sudah dibatalkan");
        }

        
        await notificationServices.createNotification({
            user_id: user_id,
            judul: "Reservasi Baru",
            pesan: `Reservasi ruangan berhasil dibuat. Silakan berkunjung.`,
            tipe: "reservasi"
        });
    }
    



    async getAvailableReservationRooms(waktu_mulai: Date, waktu_selesai: Date): Promise<any> {
        // Step 1: Get all reservations that are active and match the time range
        const activeReservations = await reservationRepository
            .createQueryBuilder("reservation")
            .where(`
                reservation.waktu_mulai <= :waktu_selesai AND reservation.waktu_selesai >= :waktu_mulai
            `)
            .andWhere("reservation.status_reservasi = :status", { status: "aktif" }) // Filter by active reservations
            .setParameters({ waktu_mulai, waktu_selesai })
            .getMany(); // Use getMany() instead of getRawMany to retrieve full entity data
    
            if (activeReservations.length === 0) {
                return { availableRooms: [] };
            }
            
        // Step 2: Get all rooms from coworking table
        const allRooms = await coworkingRepository.find({
            order: { no_ruang: 'ASC' }
        });
    
        // Step 3: Format the response with availability based on reservation status
        const availableRooms = allRooms.map(room => {
            // Find the active reservation for this room (coworking_id)
            const reservation = activeReservations?.find(res => res.coworking_id === room.coworking_id);
            
            let available = false; // Default to unavailable
            let reservation_id = null; // Default to no reservation
    
            // Check if a reservation exists for the room
            if (reservation) {
                // Set availability based on the reservation status
                if (reservation.status_reservasi === 'aktif') {
                    available = true; // Room is available if status is "aktif"
                }
                reservation_id = reservation.reservation_id; // Set the reservation_id
            }
    
            return {
                booking_number: room.no_ruang, // Display the room number
                reservation_id: reservation_id, // Display the reservation ID
                available: available, // Set availability based on reservation status
                selected: false // Default to not selected
            };
        });
    
        // Step 4: Return the available rooms
        return { availableRooms };
    }
    

    private async checkRoomAvailability(
        coworking_id: number,
        waktu_mulai: Date,
        waktu_selesai: Date
    ): Promise<boolean> {
        const existingReservation = await reservationRepository
            .createQueryBuilder("reservation")
            .where("reservation.coworking_id = :coworking_id", { coworking_id })
            .andWhere(`
                (reservation.waktu_mulai <= :waktu_mulai AND reservation.waktu_selesai >= :waktu_mulai)
                OR
                (reservation.waktu_mulai <= :waktu_selesai AND reservation.waktu_selesai >= :waktu_selesai)
            `)
            .setParameters({ waktu_mulai, waktu_selesai })
            .getOne();

        return !existingReservation;
    }

    async getAllReservations(): Promise<Reservation[]> {
        return await reservationRepository.find({
            relations: ['user', 'coworking', 'reviews'],
            order: { waktu_mulai: 'DESC' }
        });
    }

    async getAllReservationsUser(user_id: number): Promise<Reservation[]> {
        return await reservationRepository.find({
            relations: ['user', 'coworking', 'reviews'], // Mengambil relasi dengan user, coworking, dan reviews
            where: {
                user_id: user_id // Menambahkan kondisi where untuk memfilter berdasarkan user_id
            },
            order: { waktu_mulai: 'DESC' } // Mengurutkan berdasarkan waktu_mulai secara menurun
        });
    }
    
    

    async getPendingReservations(): Promise<Reservation[]> {
        return await reservationRepository.find({
            where: { status_reservasi: "menunggu_pembayaran" },
            relations: ['user', 'coworking'],
            order: { waktu_mulai: 'DESC' }
        });
    }

    async updateStatusReservasi(
        reservation_id: number, 
        status: string, 
    ): Promise<Reservation> {
        const reservation = await reservationRepository.findOne({
            where: { reservation_id },
            relations: ['user']
        });
        
        if (!reservation) {
            throw new Error("Reservasi tidak ditemukan");
        }

        reservation.status_reservasi = status;
        
     

        return await reservationRepository.save(reservation);
    }

    async getDashboardStats(): Promise<any> {
        // Mengambil waktu hari ini untuk filter berdasarkan waktu
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
        // Menggunakan Promise.all untuk menjalankan semua query secara paralel
        const [
            totalReservasi,
            totalActive,
            totalNonactive,
        ] = await Promise.all([
            // Total Reservasi
            reservationRepository.count(),
            
            // Total Reservasi dengan status 'pending'
            reservationRepository.count({
                where: { status_reservasi: "aktif" }
            }),
            
            // Total Reservasi dengan status 'approved'
            reservationRepository.count({
                where: { status_reservasi: "nonaktif" }
            }),
            
       
        ]);
    
        // Mengembalikan hasil statistik
        return {
            totalReservasi,
            totalActive,
            totalNonactive,
        };
    }

    async deleteReservation(reservationId: number): Promise<void> {
        const reservation = await reservationRepository.findOneBy({ reservation_id: reservationId });
        if (!reservation) {
            throw new Error("reservation tidak ditemukan");
        }

        await reservationRepository.delete(reservationId);
    }
}

const reservationServices = new ReservationServices();
export default reservationServices; 