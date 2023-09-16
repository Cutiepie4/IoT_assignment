import React, { useState, useEffect } from 'react';
import { enableRFID, disableRFID, add_copy } from '../services/API';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

function Import(props) {

    const { bookId } = useParams();
    const [id, setId] = useState('');

    const [enable, setEnable] = useState(false);

    const [listId, setListId] = useState([]);

    const handleSwitch = () => {
        if (enable)
            disableRFID();
        else
            enableRFID();
        setEnable(!enable);
    }

    const handleImport = () => {
        if (window.confirm("Are you sure to import all these id ?")) {
            add_copy({ 'book_id': bookId, 'copy_id': listId });
            setListId([]);
        }
    }

    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('add-copy', (copy_id) => {
            setListId(prev => [...prev, copy_id]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className='container form-control mt-3' style={{ maxWidth: '300px' }}>
            <div className='d-flex justify-content-between align-items-center mb-3'>
                <input type='text' className='form-control me-2' placeholder='Enter the copy id here...' onChange={(e) => setId(e.target.value)} value={id} />
                <button className='btn btn-success' onClick={() => { setListId([...listId, { 'card_id': id }]); setId(''); }} disabled={id.length == 0 ? true : false}>Add</button>
            </div>
            <ul className="list-group mb-3">
                {listId.map((item) => (
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        {item.card_id}
                        <i className="fa-regular fa-trash-can fa-md trash-can-icon" onClick={() => { setListId(listId.filter(itemFilter => itemFilter.card_id != item.card_id)) }}></i>
                    </li>
                ))}
            </ul>
            <div className='d-flex justify-content-between'>
                <button className='btn btn-success' disabled={listId.length == 0 ? true : false} onClick={handleImport}>Import</button>
                <button className='btn btn-primary' onClick={handleSwitch}>{enable ? 'Stop' : 'Read RFID'}</button>
            </div>
        </div>
    );
}

export default Import;