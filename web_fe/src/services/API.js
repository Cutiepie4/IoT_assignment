import axios from "axios";
import { toast } from 'react-toastify'

export const api = axios.create({
    baseURL: 'http://localhost:5000/'
})

export const createConfig = () => {
    const token = sessionStorage.getItem('token');

    return {
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
            "Authorization": `Bearer ${token}`
        }
    }
}

const hasToken = () => {
    const token = sessionStorage.getItem('token');
    return !(token == null)
}

export const isLoggedIn = () => {
    return hasToken() == true;
}

export const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
};

export function formatMongoDate(mongoDate) {
    const dateStr = mongoDate["$gte"];
    const date = new Date(dateStr);
    const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "GMT"
    };

    return date.toLocaleString(undefined, options);
}

export const findAllBooks = async () => {
    const res = await api.get('/find-all-books')
        .then(res => res)
        .catch(error => { toast.error(error.response.data.message); return [] });
    return res.data;
}

export const findBook = async (book_id) => {
    const res = await api.get(`/find-by-book-id/${book_id}`)
        .then(res => res)
        .catch(error => { toast.error(error.response.data.message); return {} })
    return res.data;
}

export const addBook = async (formData) => {
    await api.post('/add-book', formData)
        .then(res => { toast.success(res.data.message) })
        .catch(error => { toast.error(error.response.data.message) });
}

export const updateBook = async (payload) => {
    await api.put('/update-book', payload)
        .then(res => { toast.success(res.data.message) })
        .catch(error => { toast.error(error.response.data.message) });
}

export const addCopy = async (payload) => {
    await api.post('/add-copy', payload)
        .then(res => { toast.success(res.data.message) })
        .catch(error => { toast.error(error.response.data.message) });
}

export const deleteBook = async (card_id) => {
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

export const findCopies = async (bookId) => {
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

export const findAllUsers = async () => {
    const res = await api.get('/find-all-users')
        .then(res => res)
        .catch(error => { toast.error(error.response.data.message); });
    return res.data;
}

export const checkout = async (order) => {
    console.log(order)
    return await api.post('/checkout', order)
        .then(res => { toast.success(res.data); return true })
        .catch(error => { toast.error(error.response.data.message); return false });
}

export const addComment = async (bookId, comment) => {
    if (!hasToken()) {
        toast.error('Please sign-in to comment.');
    }
    const data = await api.post(`/add-comment/${bookId}`, comment, createConfig())
        .then(res => { toast.success(res.data.message); return res.data.comment })
        .catch(error => { toast.error(error.response.data.message); return null; });
    return data;
}

export const deleteComment = async (bookId, commentId) => {
    return await api.delete(`/delete-comment/${bookId}/${commentId}`, createConfig())
        .then(res => { toast.success(res.data.message); return true; })
        .catch(error => { toast.error(error.response.data.message); return false });
}

export const addRating = async (bookId, ratingData) => {
    await api.post(`/rating/${bookId}`, ratingData, createConfig())
        .then(res => { toast.success(res.data.message) })
        .catch(error => { toast.error(error.response.data.message) });
}

export const getUserRating = async (bookId) => {
    const data = await api.get(`/rating/${bookId}/user`, createConfig())
        .then(res => res.data)
        .catch(error => { return 0; })
    return data;
}

export const findOrderById = async (orderId) => {
    const data = await api.get(`/orders/${orderId}`)
        .then(res => res.data)
        .catch(error => { toast.error(error.response.data.message) });
    return data;
}

export const createUser = async (account) => {
    api.post('/create-user', account)
        .then(res => { toast.success(res.data.message); })
        .catch(error => { toast.error(error.response.data.message) });
}

export const signIn = async (payload) => {
    const data = await api.post('/login', payload)
        .then(res => res.data)
        .catch(error => { toast.error(error.response.data.message); return false; });
    if (data) {
        sessionStorage.setItem('token', data.access_token);
        return true;
    }
    return false;
}

export const identifyUser = async () => {
    const data = await api.get('/protected', createConfig())
        .then(res => res.data)
        .catch(error => { toast.error(error.response.data.message); return null });
    return data;
}