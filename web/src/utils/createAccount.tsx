import { api } from "../Api";

export const createAccount = async (form: { [k: string]: FormDataEntryValue; }) => {
    await api.post('/user', {
        nama: form.nama,
        email: form.email,
        password: form.password,
    })
}