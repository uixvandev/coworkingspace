import { useEffect, useState } from 'react';
import { api } from '../../../Api';
import { useUser } from '../../../context/UserContext';
import { Loading } from '../Loading';
import { toast } from 'react-toastify';

interface INotification {
    notification_id: number;
    judul: string;
    pesan: string;
    tipe: string;
    dibaca: boolean;
    waktu_notifikasi: string;
}

export const NotificationTab = () => {
    const { user, token } = useUser();
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = async () => {
        try {
            const response = await api.get(`/notifikasi/user/${user.user_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data);
        } catch (error) {
            //toast.error('Gagal memuat notifikasi');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId: number) => {
        try {
            await api.post(`/notifikasi/${notificationId}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            loadNotifications(); // Reload to update status
        } catch (error) {
            toast.error('Gagal menandai notifikasi sebagai dibaca');
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="mt-[3%] w-full min-h-[500px] bg-backgroundLight rounded-xl flex flex-col text-paragraph font-semibold text-lg px-9 py-5">
            <h2 className="text-2xl text-highlight mb-6">Notifikasi</h2>
            
            <div className="flex flex-col gap-4">
                {notifications.length === 0 ? (
                    <p className="text-center text-paragraph">Tidak ada notifikasi</p>
                ) : (
                    notifications.map((notification) => (
                        <div 
                            key={notification.notification_id}
                            className={`p-4 rounded-lg border ${notification.dibaca ? 'bg-background/50' : 'bg-background border-highlight'}`}
                            onClick={() => !notification.dibaca && markAsRead(notification.notification_id)}
                        >
                            <div className="flex justify-between items-start">
                                <h3 className="text-highlight font-bold">{notification.judul}</h3>
                                <span className="text-sm text-paragraph">
                                    {new Date(notification.waktu_notifikasi).toLocaleString()}
                                </span>
                            </div>
                            <p className="mt-2">{notification.pesan}</p>
                            {!notification.dibaca && (
                                <div className="mt-2 text-sm text-highlight">
                                    Klik untuk menandai sudah dibaca
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
