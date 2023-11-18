import React, { useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { enableRFIDSingle, findUser, updateMemberId } from '../services/API';

function MemberRegister(props) {
    const { userId } = props;
    const [memberId, setMemberId] = useState('');

    const handleUpdate = () => {
        if (memberId.length > 0) {
            updateMemberId({ userId, memberId });
        }
    }

    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('sign-up', (card) => {
            if (Object.keys(card).length === 0 && card.constructor === Object) {
                toast.error('Cannot use this card.');
            }
            else
                setMemberId(prev => card['card_id']);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const asyncFunction = async () => {
            const userData = await findUser(userId);
            setMemberId(userData?.member_id ? userData.member_id : '');
        }
        asyncFunction();
    }, [])

    return (
        <div className="container p-md-5">
            <div className="row justify-content-center">
                <div className="col-md-10 col-lg-6 col-xl-5">
                    <div className='d-flex align-items-center mb-3'>
                        <i className="fas fa-tag fa-lg me-3 fa-fw"></i>
                        <input type='text' className='form-control me-2' placeholder='Member card'
                            onChange={(e) => setMemberId(e.target.value)} value={memberId} />
                        <button className='btn btn-outline-info' onClick={enableRFIDSingle}>RFID</button>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="button" className="btn btn-primary" onClick={handleUpdate}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MemberRegister;