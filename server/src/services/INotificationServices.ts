import { Notification } from "../entities/Notification";

export interface INotificationRequest {
    user_id: number;
    judul: string;
    pesan: string;
    tipe: string;
}

export default interface INotificationServices {
    getNotificationsByUser(user_id: number): Promise<Notification[]>;
    createNotification(data: INotificationRequest): Promise<Notification>;
    markAsRead(notification_id: number): Promise<Notification>;
    getUnreadCount(user_id: number): Promise<number>;
} 