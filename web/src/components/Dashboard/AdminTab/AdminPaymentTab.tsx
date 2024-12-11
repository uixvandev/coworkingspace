import { useEffect, useState } from 'react';
import { api } from '../../../Api';
import { useUser } from '../../../context/UserContext';
import { Loading } from '../Loading';
import { toast } from 'react-toastify';
import { CheckCircle, XCircle } from 'phosphor-react';

interface IPayment {
    payment_id: number;
    jumlah_pembayaran: number;
    metode_pembayaran: string;
    waktu_pembayaran: string;
    status_pembayaran: string;
    reservation: {
        user: {
            nama: string;
        }
    }
}

export const AdminPaymentTab = () => {
    const { token } = useUser();
    const [payments, setPayments] = useState<IPayment[]>([]);
    const [loading, setLoading] = useState(true);

    const loadPayments = async () => {
        try {
            const response = await api.get('/admin/payments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPayments(response.data);
        } catch (error) {
            //toast.error('Gagal memuat data pembayaran');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyPayment = async (paymentId: number) => {
        if (window.confirm('Verifikasi pembayaran ini?')) {
            try {
                await api.post(`/admin/payments/${paymentId}/verify`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Pembayaran berhasil diverifikasi');
                loadPayments();
            } catch (error) {
                toast.error('Gagal memverifikasi pembayaran');
            }
        }
    };

    const handleRejectPayment = async (paymentId: number) => {
        if (window.confirm('Tolak pembayaran ini?')) {
            try {
                await api.post(`/admin/payments/${paymentId}/reject`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Pembayaran berhasil ditolak');
                loadPayments();
            } catch (error) {
                toast.error('Gagal menolak pembayaran');
            }
        }
    };

    useEffect(() => {
        loadPayments();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="mt-[3%] w-full min-h-[500px] bg-backgroundLight rounded-xl flex flex-col text-paragraph font-semibold text-lg px-9 py-5">
            <h2 className="text-2xl text-highlight mb-6">Manajemen Pembayaran</h2>

            <div className="overflow-x-auto relative">
                <table className="w-full">
                    <thead>
                        <tr className="text-left bg-background">
                            <th className="p-4">Nama User</th>
                            <th className="p-4">Jumlah</th>
                            <th className="p-4">Metode</th>
                            <th className="p-4">Waktu</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(payment => (
                            <tr key={payment.payment_id} className="border-b border-background">
                                <td className="p-4">{payment.reservation.user.nama}</td>
                                <td className="p-4">Rp {payment.jumlah_pembayaran.toLocaleString()}</td>
                                <td className="p-4">{payment.metode_pembayaran}</td>
                                <td className="p-4">{new Date(payment.waktu_pembayaran).toLocaleString()}</td>
                                <td className="p-4">{payment.status_pembayaran}</td>
                                <td className="p-4">
                                    {payment.status_pembayaran === 'pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleVerifyPayment(payment.payment_id)}
                                                className="p-2 hover:bg-background rounded-full text-success"
                                                title="Verifikasi"
                                            >
                                                <CheckCircle size={24} />
                                            </button>
                                            <button
                                                onClick={() => handleRejectPayment(payment.payment_id)}
                                                className="p-2 hover:bg-background rounded-full text-attention"
                                                title="Tolak"
                                            >
                                                <XCircle size={24} />
                                            </button>
                                        </div>
                                    )}
                                        {payment.status_pembayaran === 'verified' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleRejectPayment(payment.payment_id)}
                                                className="p-2 hover:bg-background rounded-full text-attention"
                                                title="Tolak"
                                            >
                                                <XCircle size={24} />
                                            </button>
                                        </div>
                                    )}
                                      {payment.status_pembayaran === 'rejected' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleVerifyPayment(payment.payment_id)}
                                                className="p-2 hover:bg-background rounded-full text-success"
                                                title="Verifikasi"
                                            >
                                                <CheckCircle size={24} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};