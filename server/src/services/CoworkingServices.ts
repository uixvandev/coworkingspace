import { Coworking } from "../entities/Coworking";
import { coworkingRepository } from "../repositories/CoworkingRepository";
import ICoworkingServices, { ICoworkingRequest } from "./ICoworkingServices";
import notificationServices from "./NotificationServices";
import { Between } from "typeorm";

class CoworkingServices implements ICoworkingServices {
    async getAllRooms(): Promise<Coworking[]> {
        return await coworkingRepository.find({
            order: { no_ruang: 'ASC' }
        });
    }

    async getRoomById(coworking_id: number): Promise<Coworking> {
        const room = await coworkingRepository.findOneBy({ coworking_id });
        if (!room) {
            throw new Error("Ruangan tidak ditemukan");
        }
        return room;
    }

    async createRoom(data: ICoworkingRequest): Promise<Coworking> {
        const room = coworkingRepository.create(data);
        return await coworkingRepository.save(room);
    }

    async updateRoom(coworking_id: number, data: Partial<ICoworkingRequest>): Promise<Coworking> {
        const room = await this.getRoomById(coworking_id);
        
        coworkingRepository.merge(room, data);
        return await coworkingRepository.save(room);
    }

    async deleteRoom(coworking_id: number): Promise<void> {
        const room = await this.getRoomById(coworking_id);
        await coworkingRepository.remove(room);
    }

    async updateRoomStatus(coworking_id: number, status: string): Promise<Coworking> {
        const room = await this.getRoomById(coworking_id);
        
        room.status_ruang = status;
        
        // Jika status berubah menjadi tidak tersedia, kirim notifikasi ke admin
        if (status === 'tidak_tersedia') {
            await notificationServices.createNotification({
                user_id: Number(room.id_admin),
                judul: "Status Ruangan Berubah",
                pesan: `Ruangan ${room.no_ruang} telah diubah statusnya menjadi tidak tersedia`,
                tipe: "room_status"
            });
        }

        return await coworkingRepository.save(room);
    }

    async getAvailableRooms(): Promise<Coworking[]> {
        try {
            // Only get rooms with status 'tersedia'
            return await coworkingRepository.find({
                where: { status_ruang: 'available' },
                order: { coworking_id: 'ASC' }
            });
        } catch (error) {
            console.error('Service error:', error);
            throw error;
        }
    }
    
    
    
}

const coworkingServices = new CoworkingServices();
export default coworkingServices; 

