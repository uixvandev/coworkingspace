import { useEffect, useState } from "react"
import { IUpcomingBooking } from "../../../@types/Book";
import { api } from "../../../Api";
import { useUser } from "../../../context/UserContext";
import { Loading } from "../Loading";
import { UpcomingBookings } from "./UpcomingReservations";
import { toast } from "react-toastify";

export const UpcomingBookingsTab = () => {
    const { user, token } = useUser();
    const [reservations, setReservations] = useState<IUpcomingBooking[]>([]);
    const [loading, setLoading] = useState(true);

    const loadReservations = async () => {
        try {
            const response = await api.get('/reservasi/all/'+user.user_id, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReservations(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (reservation_id: number, komentar: string) => {
        try {
            await api.post('/review', {
                reservation_id,
                komentar
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Review submitted successfully');
            loadReservations();
        } catch (error) {
            toast.error('Failed to submit review');
        }
    };

    const handleCancel = async (reservation_id: number) => {
        try {
            await api.get('/reservasi/reject/'+reservation_id, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Cancel successfully');
            loadReservations();
        } catch (error) {
            toast.error('Failed to cancel');
        }
    };

    useEffect(() => {
        loadReservations();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="mt-[3%] w-full bg-backgroundLight rounded-xl p-6">
               <div className=" w-full min-h-[300px] bg-backgroundLight rounded-xl flex flex-col text-paragraph font-semibold text-lg px-3">
            <h2 className="text-2xl text-highlight mb-6">Riwayat Reservation</h2>

                <div className="overflow-x-auto relative">
                    <div className="w-full h-full overflow-x-scroll">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr className="text-left bg-background">
                                    <th className="p-4">Room</th>
                                    <th className="p-4">Start Time</th>
                                    <th className="p-4">End Time</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Review</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
            {reservations.map(reservation => (
                <UpcomingBookings 
                    key={reservation.reservation_id}
                    {...reservation}
                    onCancel={() => handleCancel(reservation.reservation_id)}
                    onReviewSubmit={handleReview}
                />
            ))}

               </tbody>
                        </table>
                    </div>
                </div>
                </div>
            </div>

         
    );
};