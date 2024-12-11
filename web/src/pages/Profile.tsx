import { Buildings, IdentificationCard, PencilSimpleLine, ShareNetwork, Lock } from "phosphor-react";
import { FormEvent } from "react";

import { Link, useNavigate } from "react-router-dom";
import { api } from "../Api";
import { Input } from "../components/Input";
import { useUser } from "../context/UserContext";

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export const Profile = () => {
    const { user, token, setAuthenticated } = useUser();
    const navigate = useNavigate();

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const form = Object.fromEntries(formData);

        if (!form.nama) {
            toast.error('Name cannot be empty');
            return;
        }

        try {
            await api.post('/profile/update', {
                user_id: user.user_id,
                nama: form.nama,
                email: form.email,
                no_telp: form.no_telp
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
        
            toast.success('Profile updated successfully');
            navigate('/dashboard');
            setAuthenticated(undefined);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <div className="bg-background bg-cover w-screen h-screen overflow-y-auto flex">
            <div className="w-[400px] h-[500px] mx-auto self-center p-8 opacity-95 rounded-[30px] bg-backgroundLight relative before:content-[''] before:absolute before:bg-secondary before:opacity-10 before:inset-0 before:-rotate-[4deg] before:-z-10 before:rounded-[30px] mobileSignup:w-[350px]">
                <div>
                    <PencilSimpleLine className="mr-auto ml-auto mt-2" color="#e8e4e6" size={45} weight="bold" />
                    <h1 className="font-open text-main text-center font-extrabold text-3xl mt-5">Edit Profile</h1>
                </div>
                <div>
                    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5 relative">
                        <div className="relative mx-auto">
                            <span><IdentificationCard className="inline absolute top-4 left-5" size={24} /></span>
                            <Input name="nama" id="nama" type='text' placeholder="Full name*" warning="false" defaultValue={user.nama} />
                        </div>
                        
                        <div className="relative mx-auto">
                            <span><Buildings className="inline absolute top-4 left-5" size={24} /></span>
                            <Input name="email" id="email" type='email' placeholder="Email" warning="false" defaultValue={user.email} />
                        </div>

                        <div className="relative mx-auto">
                            <span><ShareNetwork className="inline absolute top-4 left-5" size={24} /></span>
                            <Input name="no_telp" id="no_telp" type='tel' placeholder="Phone Number" warning="false" defaultValue={user.no_telp} />
                        </div>

                        <button className="w-36 mx-auto h-12 rounded-full font-extrabold bg-highlight hover:bg-[#FFB340] hover:scale-105 duration-300" type="submit">
                            Update Profile
                        </button>
                    </form>
                    <div className="mt-5 text-sm text-secondary font-semibold font-open text-center">
                        <Link to="/dashboard" className="text-main hover:underline">Return</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};