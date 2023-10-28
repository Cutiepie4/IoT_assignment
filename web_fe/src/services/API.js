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

export const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
};

export const find_all_books = async () => {
    const res = await api.get('/find-all-books')
        .then(res => res)
        .catch(error => { toast.error(error.response.data.message); return [] });
    return res.data;
}

export const find_book = async (book_id) => {
    const res = await api.get(`/find-by-book-id/${book_id}`)
        .then(res => res)
        .catch(error => { toast.error(error.response.data.message); return {} })
    return res.data;
}

export const add_book = async (formData) => {
    await api.post('/add-book', formData)
        .then(res => { toast.success(res.data.message) })
        .catch(error => { toast.error(error.response.data.message) });
}

export const update_book = async (payload) => {
    await api.put('/update-book', payload)
        .then(res => { toast.success(res.data.message) })
        .catch(error => { toast.error(error.response.data.message) });
}

export const add_copy = async (payload) => {
    await api.post('/add-copy', payload)
        .then(res => { toast.success(res.data.message) })
        .catch(error => { toast.error(error.response.data.message) });
}

export const delete_book = async (card_id) => {
    await api.delete(`/delete-book/${card_id}`)
        .then(res => { toast.success(res.data.message) })
        .catch(error => { toast.error(error.response.data.message) });
}

export const enableRFIDSingle = async () => {
    await api.get('/enable_single_mode')
        .then(res => { toast.success(res.data); })
        .catch(error => { toast.error(error.response.data.message); });
}

export const enableRFIDContinuous = async () => {
    await api.get('/enable_continuous_mode')
        .then(res => { toast.success(res.data); })
        .catch(error => { toast.error(error.response.data.message); });
}

export const disableRFIDContinuous = async () => {
    await api.get('/disable_continuous_mode')
        .then(res => { })
        .catch(error => { });
}

export const find_copies = async (bookId) => {
    const res = await api.get(`/find-copies/${bookId}`)
        .then(res => res)
        .catch(error => { toast.error(error.response.data.message); })
    return res.data;
}

export const deleteCopy = async (copyId) => {
    await api.delete(`/delete-copy/${copyId}`)
        .then(res => { toast.success(res.data.message) })
        .catch(error => { toast.error(error.response.data.message) });
}

export const find_all_user = async () => {
    const res = await api.get('/find-all-users')
        .then(res => res)
        .catch(error => { toast.error(error.response.data.message); });
    return res.data;
}

export const create_user = async (account) => {
    api.post('/create-user', account)
        .then(res => { toast.success(res.data.message); })
        .catch(error => { toast.error(error.response.data.message) });
}

export const checkout = async (order) => {
    return await api.post('/checkout', order)
        .then(res => { toast.success(res.data); return true })
        .catch(error => { toast.error(error.response.data.message); return false });
}

export const addComment = async (bookId, commentData) => {
    await api.post(`/add-comment/${bookId}`, commentData)
        .then(res => { toast.success(res.data.message) })
        .catch(error => { toast.error(error.response.data.message) });
}

export const deleteComment = async (bookId, commentId) => {
    await api.delete(`/delete-comment/${bookId}/${commentId}`)
        .then(res => { toast.success(res.data.message) })
        .catch(error => { toast.error(error.response.data.message) });
}

export const get_comments = async (bookID) => {
    const res = await api.get(`/get-comments/${book_id}`)
        .then(res => res)
        .catch(error => { toast.error(error.response.data.message); return [] });
    return res.data;
}
