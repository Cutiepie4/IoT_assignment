import React, { useState, useEffect } from 'react';
import { addCopy, enableRFIDContinuous, disableRFIDContinuous } from '../services/API';
import { io } from 'socket.io-client';

function Import(props) {

    const { bookId } = props;
    const [id, setId] = useState('');
    const [enableState, setEnableState] = useState(false);
    const [listId, setListId] = useState(new Set());

    const handleSwitch = () => {
        if (enableState)
            disableRFIDContinuous();
        else
            enableRFIDContinuous();
        setEnableState(!enableState);
    }

    const handleImport = () => {
        if (window.confirm("Are you sure to import all these id ?")) {
            const idArray = Array.from(listId);
            const objectList = idArray.map((str) => {
                return { card_id: str };
            });
            addCopy({ 'book_id': bookId, 'copy_id': objectList });
            setListId(new Set());
        }
    }

    const addValue = (newValue) => {
        const updatedSet = new Set(listId);
        updatedSet.add(newValue);
        setListId(updatedSet);
    };

    const removeValue = (valueToRemove) => {
        const updatedSet = new Set(listId);
        updatedSet.delete(valueToRemove);
        setListId(updatedSet);
    };

    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('import', (copy) => {
            setListId(prev => new Set([...prev, copy['card_id']]));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className='container form-control mt-3' style={{ maxWidth: '300px' }}>
            <div className='d-flex justify-content-between align-items-center mb-3'>
                <input type='text' className='form-control me-2' placeholder='Enter the copy id here...'
                    onChange={(e) => setId(e.target.value)} value={id} />
                <button className='btn btn-success'
                    onClick={() => {
                        addValue(id);
                        setId('');
                    }}
                    disabled={id.length === 0}>Add</button>
            </div>
            <ul className="list-group mb-3">
                {Array.from(listId).map((item) => (
                    <li key={item} className="list-group-item d-flex justify-content-between align-items-center">
                        {item}
                        <i className="fa-regular fa-trash-can fa-md trash-can-icon" onClick={() => { removeValue(item) }}></i>
                    </li>
                ))}
            </ul>
            <div className='d-flex justify-content-between'>
                <button className='btn btn-success' disabled={listId.size === 0} onClick={handleImport}>Import</button>
                <button className='btn btn-primary' onClick={handleSwitch}>{enableState ? 'Stop' : 'Read RFID'}</button>
            </div>
        </div>
    );
}

export default Import;
