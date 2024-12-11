import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Circle } from 'phosphor-react';
import { Desks } from './Desks';
import { MeetingRooms } from './MeetingRooms';
import { useUser } from '../../../context/UserContext';
import { api } from '../../../Api';
import { ThreeDots } from 'react-loader-spinner';
import { Loading } from '../Loading';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

interface IStatus {
    booking_number: number;
    available: boolean;
    selected: boolean;
    reservation_id:number;
}


// Remove Default_Rooms constant

const Default_Rooms: IStatus[] = []; // Empty array instead of predefined rooms


export const ReservationTab = () => {
    const { user, token } = useUser();
    const [rooms, setRooms] = useState<IStatus[]>(Default_Rooms);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [availabilityLoaded, setAvailabilityLoaded] = useState<boolean>(false);
    
    const [reservation, setReservation] = useState({
        type: '',
        booking_number: 0,
        waktu_mulai: dayjs(),
        waktu_selesai: dayjs().add(1, 'hour'),
        user_id: user.user_id,
        reservation_id:0
    });

    const loadAvailability = async () => {
        setAvailabilityLoaded(false);
        try {
            const response = await api.get('/reservasi/available', {
                params: {
                    waktu_mulai: reservation.waktu_mulai.toISOString(),
                    waktu_selesai: reservation.waktu_selesai.toISOString()
                },
                headers: { Authorization: `Bearer ${token}` }
            });

            // Set rooms based on available rooms from API
            setRooms(response?.data?.availableRooms?.map(roomNumber => ({
                booking_number: roomNumber.booking_number,
                available: roomNumber.available,
                selected: false,
                reservation_id:roomNumber.reservation_id
            })));

        } catch (error) {
            //toast.warn('room not available');
            console.log(error);
            setRooms([]); // Set empty array on error
        } finally {
            setAvailabilityLoaded(true);
        }
    };


    const selectRoom = (booking_number: number, index: number, reservation_id:number) => {
        if (rooms[index].available) {
            setRooms(rooms.map(room =>
                room.booking_number === booking_number
                    ? { ...room, selected: true }
                    : { ...room, selected: false }
            ));
            setReservation({ ...reservation, type: 'room', booking_number, reservation_id});
        }
    };

    const handleReservation = async () => {
        if (!reservation.booking_number) {
            toast.error('Please select a desk or room');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.put('/reservasi/update', {
                user_id: user.user_id,
                reservation_id: reservation.reservation_id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            toast.success('Reservation successful');
            // Reset form
            setReservation({
                type: '',
                booking_number: 0,
                waktu_mulai: dayjs(),
                waktu_selesai: dayjs().add(1, 'hour'),
                user_id: user.user_id,
                reservation_id:0
            });
            loadAvailability();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to make reservation');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        loadAvailability();
    }, [reservation.waktu_mulai, reservation.waktu_selesai]);

    return (
        <div className="mt-[3%] w-full min-h-[500px] bg-backgroundLight rounded-xl flex flex-col text-paragraph font-semibold text-lg px-9 py-5">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="flex gap-4 mb-6">
                    <DateTimePicker
                       ampm={false} 
                        label="Start Time"
                        value={reservation.waktu_mulai}
                        onChange={(newValue) =>
                            setReservation({...reservation, waktu_mulai: newValue})
                        }
                        className="bg-background rounded"
                        sx={{
                            '& .MuiInputLabel-root': { color: 'white' },
                            '& .MuiOutlinedInput-input': { color: 'white' },
                            '& .MuiIconButton-root': { color: 'white' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }
                        }}
                    />
                    <DateTimePicker
                    ampm={false}
                        label="End Time"
                        value={reservation.waktu_selesai}
                        onChange={(newValue) =>
                            setReservation({...reservation, waktu_selesai: newValue})
                        }
                        minDateTime={reservation.waktu_mulai}
                        className="bg-background rounded"
                        sx={{
                            '& .MuiInputLabel-root': { color: 'white' },
                            '& .MuiOutlinedInput-input': { color: 'white' },
                            '& .MuiIconButton-root': { color: 'white' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }
                        }}
                    />                </div>
            </LocalizationProvider>

            <div className="flex flex-row gap-8">
                <div className="w-2/3">
                    <div className="h-[350px] border-background border-2 rounded-xl">
                        {availabilityLoaded ? (
                            <>
                              
                                <div className="h-[116px] grid grid-cols-3 justify-items-center items-center">
                                    {rooms.map((room, index) => (
                                        <div key={room.booking_number} 
                                             onClick={() => selectRoom(room.booking_number, index, room.reservation_id)}>
                                            <MeetingRooms {...room} />
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <Loading />
                        )}
                    </div>
                    
                    <div className="flex flex-row mt-4 gap-1 items-center justify-end text-sm">
                        <Circle size={16} color="#e8e4e6" weight="fill" />
                        <p>Available</p>
                        <Circle className="ml-8" size={16} color="#e16162" weight="fill" />
                        <p>Not Available</p>
                        <Circle className="ml-8" size={16} color="#f9bc60" weight="fill" />
                        <p>Selected</p>
                    </div>
                </div>

                <div className="w-1/3 mt-6">
                    <div>
                        <h3 className="text-xl mb-4">Reservation Details</h3>
                        <hr />
                        <div className="mt-4 space-y-2">
                            <p>Number: {reservation.booking_number || '-'}</p>
                            <p>Start: {reservation.waktu_mulai.format('DD/MM/YYYY HH:mm')}</p>
                            <p>End: {reservation.waktu_selesai.format('DD/MM/YYYY HH:mm')}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleReservation}
                        disabled={!reservation.booking_number || isSubmitting}
                        className={`mt-6 w-full py-3 rounded-lg text-background font-bold
                            ${!reservation.booking_number 
                                ? 'bg-disabled' 
                                : 'bg-highlight hover:bg-[#FFB340]'}`}
                    >
                        {isSubmitting ? (
                            <ThreeDots height="24" width="24" color="#001e1d" />
                        ) : (
                            'Make Reservation'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};