import { FormEvent, useState } from "react";

import { createAccount } from "../utils/createAccount";
import { checkEmailAlreadyUsing } from "../utils/CheckEmailAlreadyUsing";
import { inputEmpty, verifyEmail } from "../utils/formValidate";
import { SignUpConfirm } from "../components/SignUp/SignUpConfirm";
import { SignUpForm } from "../components/SignUp/SignUpForm";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
    const [requiredNama, setRequireNama] = useState<string>('false');
    const [requiredEmail, setRequireEmail] = useState<string>('false');
    const [requiredPassword, setRequirePassword] = useState<string>('false');
    const [formEmail, setFormEmail] = useState<string>('');
    const [formNama, setFormNama] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const navigate=useNavigate()
    let timer: number;

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(event.target as HTMLFormElement);
        const form = Object.fromEntries(formData);
        timer = window.setTimeout(() => formValidate(form), 1000);
    }

    const formValidate = async (form: { [k: string]: FormDataEntryValue; }) => {
        if (form.nama === "" || form.email === "" || form.email.toString().indexOf('@') === -1 || form.password === "") {
            setRequireNama(inputEmpty(form.nama.toString()));
            setRequireEmail(inputEmpty(form.email.toString()));
            setRequirePassword(inputEmpty(form.password.toString()));
            setRequireEmail(verifyEmail(form.email.toString()));

            if (verifyEmail(form.email.toString()) === 'true') {
                toast.warn('Insert a valid email ("@" is missing)', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }

            toast.warn('Fill the required fields!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setIsSubmitting(false);
            //return;
        } else {
            setRequireNama('false');
            setRequireEmail('false');
            setRequirePassword('false');
            try {
                if (await checkEmailAlreadyUsing(form)) {
                    toast.warn('This mail already being used', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                    setRequireEmail('true');
                    clearTimeout(timer);
                    setIsSubmitting(false);
                } else {
                    await createAccount(form);
                    clearTimeout(timer);
                    setFormEmail(form.email.toString());
                    setFormNama(form.nama.toString());
                    setIsSubmitting(false);
                    // setFormSubmitted(true);
                    navigate("/");
                }
            } catch (error) {
                console.log(error);
                clearTimeout(timer);
                setIsSubmitting(false);
                toast.error('Something went wrong, try again later.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
        }
    }

    const backToSignUp = () => {
        setFormSubmitted(false);
    }

    return (
        <div className="bg-login bg-cover bg-no-repeat w-screen h-screen mobileSignup:bg-loginmobile">
            <div className="flex justify-center h-full items-center" >
                <div>
                    {formSubmitted ? (
                        <SignUpConfirm nama={formNama} email={formEmail} backToSignUp={backToSignUp} />
                    ) : (
                        <SignUpForm requiredNama={requiredNama} requiredEmail={requiredEmail} requiredPassword={requiredPassword} isSubmitting={isSubmitting} handleSubmit={handleSubmit} />
                    )}
                </div>
            </div>
        </div>
    )
}
