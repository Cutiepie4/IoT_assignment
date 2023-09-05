import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function Cards() {
    const [listCards, setListCards] = useState([])

    useEffect(() => {
        socket.on('updatecardid', (card_id) => {
            console.log(card_id);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <h1>RFID Card ID: </h1>
            {listCards.map((item, index) => (<ul key={index}><li>{item.card_id}</li></ul>))}
        </div>
    );
}

export default Cards;
