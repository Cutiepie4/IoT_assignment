import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios'
import { toast } from 'react-toastify';

function Cards() {
    const [listCards, setListCards] = useState([]);

    const handleClear = async () => {
        await axios.get('http://localhost:5000/clear-card')
            .then(res => { toast.success(res.data); return res.data })
            .catch(error => { toast.error(error.response.data); return error.response.data });
    }

    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('add-card', (card_id) => {
            setListCards(prevListCards => [...prevListCards, card_id.card_id]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className='container'>
            <h1>RFID Card ID:</h1>
            <ul>{listCards.map((item, index) => (<li key={index}>{item}</li>))}</ul>
            <button onClick={handleClear} className='btn btn-success'>Clear</button>
        </div>
    );
}

export default Cards;
