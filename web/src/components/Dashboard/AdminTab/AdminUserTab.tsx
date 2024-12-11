import { useEffect, useState } from 'react';
import { api } from '../../../Api';
import { useUser } from '../../../context/UserContext';
import { Loading } from '../Loading';
import { toast } from 'react-toastify';
import { PencilSimple, Trash } from 'phosphor-react';

interface IUser {
    user_id: number;
    nama: string;
    email: string;
    role: string;
    no_telp?: string;
    tanggal_daftar: string;
}

interface IFormErrors {
    nama: string;
    email: string;
    password: string;
    no_telp: string;
}

export const AdminUserTab = () => {
    const { token } = useUser();
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<IUser | null>(null);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        password: '',
        role: 'user',
        no_telp: ''
    });
    const [formErrors, setFormErrors] = useState<IFormErrors>({
        nama: '',
        email: '',
        password: '',
        no_telp: ''
    });

    const loadUsers = async () => {
        try {
            const response = await api.get('/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            toast.error('Gagal memuat data users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    // Validasi form
    const validateForm = (): boolean => {
        let isValid = true;
        const errors: IFormErrors = {
            nama: '',
            email: '',
            password: '',
            no_telp: ''
        };

        // Validasi nama
        if (!formData.nama.trim()) {
            errors.nama = 'Nama tidak boleh kosong';
            isValid = false;
        } else if (formData.nama.length < 3) {
            errors.nama = 'Nama minimal 3 karakter';
            isValid = false;
        }

        // Validasi email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            errors.email = 'Email tidak boleh kosong';
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            errors.email = 'Format email tidak valid';
            isValid = false;
        }

        // Validasi password saat menambah user baru
        if (isAddingUser) {
            if (!formData.password) {
                errors.password = 'Password tidak boleh kosong';
                isValid = false;
            } else if (formData.password.length < 6) {
                errors.password = 'Password minimal 6 karakter';
                isValid = false;
            }
        }

        // Validasi nomor telepon (opsional)
        if (!formData.no_telp) {
            errors.no_telp = 'No. telp tidak boleh kosong';
            isValid = false;
        } 
        if (formData.no_telp) {
            const phoneRegex = /^[0-9]{10,13}$/;
          
            if (!phoneRegex.test(formData.no_telp)) {
                errors.no_telp = 'Format nomor telepon tidak valid (10-13 digit)';
                isValid = false;
            }
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleAddUser = async () => {
        if (!validateForm()) {
            toast.error('Mohon periksa kembali form anda');
            return;
        }

        try {
            await api.post('/admin/users', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('User berhasil ditambahkan');
            loadUsers();
            setIsAddingUser(false);
            setFormData({ nama: '', email: '', password: '', role: 'user', no_telp: '' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal menambahkan user');
        }
    };

    const handleUpdateUser = async (userId: number) => {
        if (!validateForm()) {
            toast.error('Mohon periksa kembali form anda');
            return;
        }

        try {
            const { password, ...updateData } = formData;
            await api.put(`/admin/users/${userId}`, updateData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('User berhasil diupdate');
            loadUsers();
            setEditingUser(null);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal mengupdate user');
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            try {
                await api.delete(`/admin/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('User berhasil dihapus');
                loadUsers();
            } catch (error) {
                toast.error('Gagal menghapus user');
            }
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="mt-[3%] w-full min-h-[500px] bg-backgroundLight rounded-xl flex flex-col text-paragraph font-semibold text-lg px-9 py-5">
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl text-highlight">Manajemen User</h2>
                <button
                    onClick={() => setIsAddingUser(true)}
                    className="bg-highlight text-background px-4 py-2 rounded-lg hover:bg-[#FFB340]"
                >
                    Tambah User
                </button>
            </div>

            <div className="overflow-x-auto relative">
                <div className="w-full h-full overflow-x-scroll">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="text-left bg-background">
                                <th className="p-4">Nama</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">No. Telp</th>
                                <th className="p-4">Tanggal Daftar</th>
                                <th className="p-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.user_id} className="border-b border-background">
                                    <td className="p-4">{user.nama}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">{user.role}</td>
                                    <td className="p-4">{user.no_telp || '-'}</td>
                                    <td className="p-4">{new Date(user.tanggal_daftar).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                        <button
                                        onClick={() => {
                                            setEditingUser(user);
                                            // Pre-fill form data with existing user data
                                            setFormData({
                                                nama: user.nama,
                                                email: user.email,
                                                password: '', // Leave password empty for editing
                                                role: user.role,
                                                no_telp: user.no_telp || ''
                                            });
                                        }}
                                        className="p-2 hover:bg-background rounded-full"
                                    >
                                        <PencilSimple size={20} />
                                    </button>

                                            <button
                                                onClick={() => handleDeleteUser(user.user_id)}
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
            </div>

            {/* Modal form dengan validasi */}
            {(isAddingUser || editingUser) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-backgroundLight p-6 rounded-lg w-[500px] border-2 border-background shadow-xl">
                        <h3 className="text-xl mb-4 text-highlight font-bold">
                            {isAddingUser ? 'Tambah User Baru' : 'Edit User'}
                        </h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (isAddingUser) {
                                handleAddUser();
                            } else if (editingUser) {
                                handleUpdateUser(editingUser.user_id);
                            }
                        }}>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Nama"
                                        value={formData.nama}
                                        onChange={(e) => setFormData({...formData, nama: e.target.value})}
                                        className={`p-2 rounded bg-background border ${formErrors.nama ? 'border-attention' : 'border-paragraph'} focus:border-highlight focus:outline-none w-full`}
                                    />
                                    {formErrors.nama && <p className="text-attention text-sm mt-1">{formErrors.nama}</p>}
                                </div>

                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className={`p-2 rounded bg-background border ${formErrors.email ? 'border-attention' : 'border-paragraph'} focus:border-highlight focus:outline-none w-full`}
                                    />
                                    {formErrors.email && <p className="text-attention text-sm mt-1">{formErrors.email}</p>}
                                </div>

                                
                                <div>
                                    <input
                                        type="tel"
                                        placeholder="No. Telp"
                                        value={formData.no_telp}
                                        onChange={(e) => setFormData({...formData, no_telp: e.target.value})}
                                        className={`p-2 rounded bg-background border ${formErrors.no_telp ? 'border-attention' : 'border-paragraph'} focus:border-highlight focus:outline-none w-full`}
                                    />
                                    {formErrors.no_telp && <p className="text-attention text-sm mt-1">{formErrors.no_telp}</p>}
                                </div>

                                {isAddingUser && (
                                    <div>
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                            className={`p-2 rounded bg-background border ${formErrors.password ? 'border-attention' : 'border-paragraph'} focus:border-highlight focus:outline-none w-full`}
                                        />
                                        {formErrors.password && <p className="text-attention text-sm mt-1">{formErrors.password}</p>}
                                    </div>
                                )}

                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    className="p-2 rounded bg-background border border-paragraph focus:border-highlight focus:outline-none w-full"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>

                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddingUser(false);
                                        setEditingUser(null);
                                        setFormErrors({ nama: '', email: '', password: '', no_telp: '' });
                                    }}
                                    className="px-4 py-2 rounded bg-attention text-background hover:bg-red-600 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded bg-highlight text-background hover:bg-[#FFB340] transition-colors"
                                >
                                    {isAddingUser ? 'Tambah' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}; 