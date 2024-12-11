
import { useEffect, useState } from 'react';
import { api } from '../../../Api';
import { useUser } from '../../../context/UserContext';
import { Loading } from '../Loading';
import { toast } from 'react-toastify';
import { PencilSimple, Trash } from 'phosphor-react';

interface ICoworking {
    coworking_id: number;
    no_ruang: string;
    status_ruang: string;
    id_admin: number;
}

interface IFormErrors {
    no_ruang: string;
}

export const AdminCoworkingTab = () => {
    const { token } = useUser();
    const [rooms, setRooms] = useState<ICoworking[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddingRoom, setIsAddingRoom] = useState(false);
    const [editingRoom, setEditingRoom] = useState<ICoworking | null>(null);
    const [formData, setFormData] = useState({
        no_ruang: '',
        status_ruang: 'available'
    });
    const [formErrors, setFormErrors] = useState<IFormErrors>({
        no_ruang: ''
    });
    const loadRooms = async () => {
        try {
            const response = await api.get('/admin/coworking', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRooms(response.data);
        } catch (error) {
            toast.error('Gagal memuat data ruangan');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRooms();
    }, []);

    const validateForm = (): boolean => {
        let isValid = true;
        const errors: IFormErrors = {
            no_ruang: ''
        };
    
        // Validasi nomor ruangan
        if (!formData.no_ruang.trim()) {
            errors.no_ruang = 'Nomor ruangan tidak boleh kosong';
            isValid = false;
        } else if (!/^[A-Za-z0-9\s-]+$/.test(formData.no_ruang)) {
            errors.no_ruang = 'Nomor ruangan hanya boleh mengandung huruf, angka, spasi dan strip';
            isValid = false;
        }
    
        setFormErrors(errors);
        return isValid;
    };
    
    const handleAddRoom = async () => {
        if (!validateForm()) {
            toast.error('Mohon periksa kembali form anda');
            return;
        }
        try {
            await api.post('/admin/coworking', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Ruangan berhasil ditambahkan');
            loadRooms();
            setIsAddingRoom(false);
            setFormData({ no_ruang: '', status_ruang: 'available' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal menambahkan ruangan');
        }
    };

    const handleUpdateRoom = async (coworkingId: number) => {
        if (!validateForm()) {
            toast.error('Mohon periksa kembali form anda');
            return;
        }
        try {
            await api.put(`/admin/coworking/${coworkingId}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Ruangan berhasil diupdate');
            loadRooms();
            setEditingRoom(null);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal mengupdate ruangan');
        }
    };

    const handleDeleteRoom = async (coworkingId: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus ruangan ini?')) {
            try {
                await api.delete(`/admin/coworking/${coworkingId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Ruangan berhasil dihapus');
                loadRooms();
            } catch (error) {
                toast.error('Gagal menghapus ruangan');
            }
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="mt-[3%] w-full min-h-[500px] bg-backgroundLight rounded-xl flex flex-col text-paragraph font-semibold text-lg px-9 py-5">
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl text-highlight">Manajemen Ruangan</h2>
                <button
                    onClick={() => setIsAddingRoom(true)}
                    className="bg-highlight text-background px-4 py-2 rounded-lg hover:bg-[#FFB340]"
                >
                    Tambah Ruangan
                </button>
            </div>

            <div className="overflow-x-auto relative">
                <table className="w-full">
                    <thead>
                        <tr className="text-left bg-background">
                            <th className="p-4">No Ruang</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map(room => (
                            <tr key={room.coworking_id} className="border-b border-background">
                                <td className="p-4">{room.no_ruang}</td>
                                <td className="p-4">{room.status_ruang}</td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingRoom(room);
                                                setFormData({
                                                    no_ruang: room.no_ruang,
                                                    status_ruang: room.status_ruang
                                                });
                                            }}
                                            className="p-2 hover:bg-background rounded-full"
                                        >
                                            <PencilSimple size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRoom(room.coworking_id)}
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

            {(isAddingRoom || editingRoom) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-backgroundLight p-6 rounded-lg w-[500px] border-2 border-background">
                        <h3 className="text-xl mb-4 text-highlight">
                            {isAddingRoom ? 'Tambah Ruangan Baru' : 'Edit Ruangan'}
                        </h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (isAddingRoom) {
                                handleAddRoom();
                            } else if (editingRoom) {
                                handleUpdateRoom(editingRoom.coworking_id);
                            }
                        }}>
                            <div className="flex flex-col gap-4">
                            <div>
                            <input
                                type="text"
                                placeholder="Nomor Ruangan"
                                value={formData.no_ruang}
                                onChange={(e) => setFormData({...formData, no_ruang: e.target.value})}
                                className={`p-2 rounded bg-background border ${formErrors.no_ruang ? 'border-attention' : 'border-paragraph'} focus:border-highlight focus:outline-none w-full`}
                            />
                            {formErrors.no_ruang && (
                                <p className="text-attention text-sm mt-1">{formErrors.no_ruang}</p>
                            )}
                        </div>

                                
                                <select
                                    value={formData.status_ruang}
                                    onChange={(e) => setFormData({...formData, status_ruang: e.target.value})}
                                    className="p-2 rounded bg-background border border-paragraph focus:border-highlight focus:outline-none"
                                >
                                    <option value="available">Available</option>
                                    <option value="not available">Not Available</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddingRoom(false);
                                        setEditingRoom(null);
                                        setFormData({ no_ruang: '', status_ruang: 'available' });
                                    }}
                                    className="px-4 py-2 rounded bg-attention text-background hover:bg-red-600"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded bg-highlight text-background hover:bg-[#FFB340]"
                                >
                                    {isAddingRoom ? 'Tambah' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

