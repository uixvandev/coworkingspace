import { Notification } from "../entities/Notification";
import { notificationRepository } from "../repositories/NotificationRepository";
import INotificationServices, { INotificationRequest } from "./INotificationServices";

class NotificationServices implements INotificationServices {
    async getNotificationsByUser(user_id: number): Promise<Notification[]> {
        return await notificationRepository.find({
            where: { user_id },
            order: { waktu_notifikasi: 'DESC' }
        });
    }

    async createNotification(data: INotificationRequest): Promise<Notification> {
        const notification = notificationRepository.create({
            ...data,
            dibaca: false
        });
        return await notificationRepository.save(notification);
    }

    async markAsRead(notification_id: number): Promise<Notification> {
        const notification = await notificationRepository.findOneBy({ notification_id });
        
        if (!notification) {
            throw new Error("Notifikasi tidak ditemukan");
        }

        notification.dibaca = true;
        return await notificationRepository.save(notification);
    }

    async getUnreadCount(user_id: number): Promise<number> {
        return await notificationRepository.count({
            where: {
                user_id,
                dibaca: false
            }
        });
    }
}

const notificationServices = new NotificationServices();
export default notificationServices; 