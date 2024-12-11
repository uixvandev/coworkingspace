import { Request, Response } from "express";
import INotificationServices from "../services/INotificationServices";

class NotificationController {
    async getNotifications(req: Request, res: Response, notificationServices: INotificationServices) {
        try {
            const user_id = Number(req.params.user_id);
            const notifications = await notificationServices.getNotificationsByUser(user_id);
            return res.status(200).json(notifications);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async markAsRead(req: Request, res: Response, notificationServices: INotificationServices) {
        try {
            const notification_id = Number(req.params.notification_id);
            const result = await notificationServices.markAsRead(notification_id);
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async getUnreadCount(req: Request, res: Response, notificationServices: INotificationServices) {
        try {
            const user_id = Number(req.params.user_id);
            const count = await notificationServices.getUnreadCount(user_id);
            return res.status(200).json({ unread_count: count });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}

const notificationController = new NotificationController();
export default notificationController; 