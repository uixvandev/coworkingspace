import { Coworking } from "../entities/Coworking";

export interface ICoworkingRequest {
    no_ruang: string;
    id_admin: number;
    status_ruang: string;
}

export default interface ICoworkingServices {
    getAllRooms(): Promise<Coworking[]>;
    getRoomById(coworking_id: number): Promise<Coworking>;
    createRoom(data: ICoworkingRequest): Promise<Coworking>;
    updateRoom(coworking_id: number, data: Partial<ICoworkingRequest>): Promise<Coworking>;
    deleteRoom(coworking_id: number): Promise<void>;
    updateRoomStatus(coworking_id: number, status: string): Promise<Coworking>;
    getAvailableRooms(): Promise<Coworking[]>;

} 

