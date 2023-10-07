import axios from "axios";
import { toast } from 'react-toastify'

export const api = axios.create({
    baseURL: 'http://localhost:5000/'
})

export const createConfig = () => {
    // const token = sessionStorage.getItem('token');
    return {
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json'
            // "Authorization": `Bearer ${token}`
        }
    }
}

export const find_all_books = async () => {
    const res = await api.get('/find-all-books')
        .then(res => res)
        .catch(error => { toast.error(error.message); return [] });
    return res.data;
}

export const find_book = async (book_id) => {
    const res = await api.get(`/find-by-book-id/${book_id}`)
        .then(res => res)
        .catch(error => { toast.error(error.message); return {} })
    return res.data;
}

export const add_book = async (formData) => {
    await api.post('/add-book', formData)
        .then(res => { toast.success(res.data.message) })
        .catch(error => { toast.error(error.message) });
}

export const update_book = async (payload) => {
    await api.put('/update-book', payload)
        .then(res => { toast.success(res.data.message) })
        .catch(error => { toast.error(error.message) });
}

export const add_copy = async (payload) => {
    await api.post('/add-copy', payload)
        .then(res => { toast.success(res.data.message) })
        .catch(error => { toast.error(error.message) });
}

export const delete_book = async (card_id) => {
    await api.delete(`/delete-book/${card_id}`)
        .then(res => { toast.success(res.data.message) })
        .catch(error => { toast.error(error.message) });
}

export const enableRFID = async () => {
    await api.get('/enable')
        .then(res => { toast.success(res.data); })
        .catch(error => { toast.error(error.response.data); });
}

export const disableRFID = async () => {
    await api.get('/disable')
        .then(res => { toast.success(res.data); })
        .catch(error => { toast.error(error.response.data); });
}

export const clearRFID = async () => {
    await api.get('/clear')
        .then(res => { toast.success(res.data); })
        .catch(error => { toast.error(error.response); });
}

export const find_copies = async (bookId) => {
    const res = await api.get(`/find-copies/${bookId}`)
        .then(res => res)
        .catch(error => { toast.error(error.response); })
    return res.data;
}

export const deleteCopy = async (copyId) => {
    await api.delete(`/delete-copy/${copyId}`)
        .then(res => { toast.success(res.data.message) })
        .catch(error => { toast.error(error.response) });
}

export const find_all_user = async () => {
    const res = await api.get('/find-all-users')
        .then(res => res)
        .catch(error => { toast.error(error.response); });
    return res.data;
}
