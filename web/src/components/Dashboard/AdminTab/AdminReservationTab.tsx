import { useEffect, useState } from 'react';
import { api } from '../../../Api';
import { useUser } from '../../../context/UserContext';
import { Loading } from '../Loading';
import { toast } from 'react-toastify';
import { Interface } from 'readline';
import { CheckCircle, Trash, XCircle } from 'phosphor-react';
import Select from 'react-select';

interface IReservation {
    reservation_id: number;
    user_id: number;
    coworking: Interface;
    waktu_mulai: string;
    waktu_selesai: string;
    status_reservasi: string;
    user: {
        nama: string;
        email: string;
    };
}

export const AdminReservationTab = () => {
    const { token, user } = useUser();
    const [reservations, setReservations] = useState<IReservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [isAddingReservation, setIsAddingReservation] = useState(false);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [formData, setFormData] = useState({
        coworking_id: null,
        waktu_mulai: '',
        waktu_selesai: ''
    });

    const handleCreateReservation = async (e) => {
        e.preventDefault();
        try {
            await api.post('/reservasi', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Reservation created');
            setIsAddingReservation(false);
            loadReservations();
        } catch (error) {
            toast.error('Failed to create reservation');
        }
    };

    const loadReservations = async () => {
        try {
            const [reservationsRes, statsRes] = await Promise.all([
                api.get('/admin/reservasi', {
                    headers: { "Authorization": `Bearer ${token}` }
                }),
                api.get('/admin/dashboard/stats', {
                    headers: { "Authorization": `Bearer ${token}` }
                })
            ]);

            setReservations(reservationsRes.data);
            setStats(statsRes.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            // toast.error('Gagal memuat data reservasi');
            setLoading(false);
        }
    };

    const updateStatus = async (reservationId: number, status: string) => {
        try {
            await api.put(`/admin/reservasi/${reservationId}/status`, 
                { status },
                { headers: { "Authorization": `Bearer ${token}` }}
            );
            toast.success('Status berhasil diperbarui');
            loadReservations();
        } catch (error) {
            console.error(error);
            toast.error('Gagal memperbarui status');
        }
    };

    const loadAvailableRooms = async () => {
        try {
            const response = await api.get('/coworking/available', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data && Array.isArray(response.data)) {
                const options = response.data.map(room => ({
                    value: room.coworking_id,
                    label: room.no_ruang
                }));
                setAvailableRooms(options);
            }
        } catch (error) {
            console.error('Load rooms error:', error);
            toast.error('Failed to load available rooms');
        }
    };
    
    const handleDeleteReservation = async (reservation_id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus reservation ini?')) {
            try {
                await api.delete(`/admin/reservasi/${reservation_id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Reservation berhasil dihapus');
                loadReservations();
            } catch (error) {
                toast.error('Gagal menghapus reservation');
            }
        }
    };

    useEffect(() => {
        loadReservations();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="mt-[3%] w-full min-h-[500px] bg-backgroundLight rounded-xl flex flex-col text-paragraph font-semibold text-lg px-9 py-5">
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl text-highlight">Manajemen Reservation</h2>
         
                <button
                onClick={() => {
                    setIsAddingReservation(true);
                    loadAvailableRooms();
                }}
                className="bg-highlight text-background px-4 py-2 rounded-lg hover:bg-[#FFB340]"
            >
                Tambah Reservation
            </button>

            </div>
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-background p-4 rounded-lg">
                    <h3 className="text-highlight">Total Reservasi</h3>
                    <p className="text-2xl">{stats?.totalReservasi}</p>
                </div>
                <div className="bg-background p-4 rounded-lg">
                    <h3 className="text-highlight">Aktif</h3>
                    <p className="text-2xl">{stats?.totalActive}</p>
                </div>
                <div className="bg-background p-4 rounded-lg">
                    <h3 className="text-highlight">Nonaktif</h3>
                    <p className="text-2xl">{stats?.totalNonactive}</p>
                </div>
             
            </div>

         
            {/* Reservations Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-background">
                            <th className="text-left p-4">ID</th>
                            <th className="text-left p-4">User</th>
                            <th className="text-left p-4">Ruangan</th>
                            <th className="text-left p-4">Waktu Mulai</th>
                            <th className="text-left p-4">Waktu Selesai</th>
                            <th className="text-left p-4">Review</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-left p-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((reservation) => (
                            <tr key={reservation.reservation_id} className="border-b border-background">
                                <td className="p-4">{reservation.reservation_id}</td>
                                <td className="p-4">{reservation?.user?.nama}</td>
                                <td className="p-4">{reservation.coworking.no_ruang}</td>
                                <td className="p-4">{new Date(reservation.waktu_mulai).toLocaleString()}</td>
                                <td className="p-4">{new Date(reservation.waktu_selesai).toLocaleString()}</td>
                                <td className="p-4">{reservation.reviews[0]?.komentar}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-sm ${
                                        reservation.status_reservasi === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                                        reservation.status_reservasi === 'approved' ? 'bg-green-200 text-green-800' :
                                        'bg-red-200 text-red-800'
                                    }`}>
                                        {reservation.status_reservasi}
                                    </span>
                                </td>
                                <td className="p-4">
                                <div className="flex gap-2">
                                {reservation.status_reservasi === 'pending' && (
                                        <div>
                                            <button
                                                onClick={() => updateStatus(reservation.reservation_id, "aktif")}
                                                className="p-2 hover:bg-background rounded-full text-success"
                                                title="Alktif"
                                            >
                                                <CheckCircle size={24} />
                                            </button>
                                            <button
                                                onClick={() => updateStatus(reservation.reservation_id, "nonaktif")}
                                                className="p-2 hover:bg-background rounded-full text-attention"
                                                title="Tolak"
                                            >
                                                <XCircle size={24} />
                                            </button>
                                        </div>
                                    )}
                                        {reservation.status_reservasi === 'aktif' && (
                                        <div >
                                        <button
                                                onClick={() => updateStatus(reservation.reservation_id, "nonaktif")}
                                                className="p-2 hover:bg-background rounded-full text-attention"
                                                title="Tolak"
                                            >
                                                <XCircle size={24} />
                                            </button>
                                        </div>
                                    )}
                                      {reservation.status_reservasi === 'nonaktif' && (
                                        <div>
                                             <button
                                                onClick={() => updateStatus(reservation.reservation_id, "aktif")}
                                                className="p-2 hover:bg-background rounded-full text-success"
                                                title="Alktif"
                                            >
                                                <CheckCircle size={24} />
                                            </button>
                                        </div>
                                    )}

                                    <button
                                                 onClick={() => handleDeleteReservation(reservation.reservation_id)}
                                                className="p-2 hover:bg-background rounded-full text-attention"
                                            >
                                                <Trash size={20} />
                                    </button>
                                    </div>
                                 
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

              {isAddingReservation && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="bg-backgroundLight p-6 rounded-lg w-[500px] border-2 border-background shadow-xl">
                          <h3 className="text-xl mb-4 text-highlight font-bold">Create Reservation</h3>
                          <form onSubmit={handleCreateReservation}>
                              <div className="flex flex-col gap-4">
                                  <Select
                                      options={availableRooms}
                                      onChange={(option) => setFormData({
                                          ...formData,
                                          coworking_id: option.value
                                      })}
                                      placeholder="Select Room"
                                      className="bg-background border border-paragraph focus:border-highlight focus:outline-none"
                                  />
                                








                                  <input
                                      type="datetime-local"
                                      onChange={(e) => setFormData({
                                          ...formData,
                                          waktu_mulai: e.target.value
                                      })}
                                      className="p-2 rounded bg-background border border-paragraph focus:border-highlight focus:outline-none w-full text-paragraph"
                                  />

                                  <input
                                      type="datetime-local"
                                      onChange={(e) => setFormData({
                                          ...formData,
                                          waktu_selesai: e.target.value
                                      })}
                                      className="p-2 rounded bg-background border border-paragraph focus:border-highlight focus:outline-none w-full text-paragraph"
                                  />
                              </div>
                              <div className="flex justify-end gap-2 mt-6">
                                  <button
                                      type="button"
                                      onClick={() => setIsAddingReservation(false)}
                                      className="px-4 py-2 rounded bg-attention text-background hover:bg-red-600 transition-colors"
                                  >
                                      Cancel
                                  </button>
                                  <button
                                      type="submit"
                                      className="px-4 py-2 rounded bg-highlight text-background hover:bg-[#FFB340] transition-colors"
                                  >
                                      Create
                                  </button>
                              </div>
                          </form>
                      </div>
                  </div>
              )}
          </div>
    );
}; 




