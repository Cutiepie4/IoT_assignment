import React, { useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { NavLink, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { createUser, enableRFIDSingle } from '../services/API';

function SignUp(props) {
    const { role } = props;
    const navigate = useNavigate();
    const [account, setAccount] = useState({ role: 'User' });

    const [alterPassword, setAlterPassword] = useState('');

    const checkEmptyInput = (text) => {
        return !text || text.trim().length == 0;
    }

    const validate = () => {
        if (checkEmptyInput(account.username) || checkEmptyInput(account.name) || checkEmptyInput(account.password) || checkEmptyInput(account.phone_number)) {
            toast.error('Please do not leave any field blank.')
            return false;
        }

        if (alterPassword !== account.password) {
            toast.error('Wrong confirm password!');
            return false;
        }
        return true;
    }

    const handleRegister = (e) => {
        if (validate() && window.confirm('Are you sure to create this user ?')) {
            const asyncFunction = async () => {
                const flag = await createUser(account);
                if (flag) {
                    if (role == 'Admin') {
                        navigate('/users')
                    }
                    else
                        navigate('/sign-in');
                }
            }
            asyncFunction();
        }
    }

    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('sign-up', (card) => {
            if (Object.keys(card).length === 0 && card.constructor === Object) {
                toast.error('Cannot use this card.');
            }
            else
                setAccount(prev => { return { ...prev, 'member_id': card['card_id'] } });
        });

        return () => {
            socket.disconnect();
        };
    }, [])

    return (
        <section style={{ backgroundColor: "#eee" }}>
            <div className="container">
                <div className="row d-flex py-5">
                    <div className="col-lg-12 col-xl-11">
                        <div className="card text-black" style={{ borderRadius: '25px' }}>
                            <div className="card-body p-md-5">
                                <div className="row justify-content-center">
                                    <div className="col-md-10 col-lg-6 col-xl-5">
                                        <p className="text-center h1 fw-bold mb-3 mt-3">Sign up</p>
                                        <div>
                                            {role == 'Admin' && <div className="d-flex justify-content-between align-items-center mb-4">
                                                <i className="fas fa-tag fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0 me-2">
                                                    <input type="text" className="form-control" placeholder='Member card' value={account.member_id} disabled />
                                                </div>
                                                <button className='btn btn-success' onClick={enableRFIDSingle}>Add</button>
                                            </div>}
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-id-badge fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input type="text" className="form-control" placeholder='Username' value={account.username} onChange={e => setAccount({ ...account, username: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input type="text" className="form-control" placeholder='Name' value={account.name} onChange={e => setAccount({ ...account, name: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-venus-mars fa-lg me-3 fa-fw"></i>
                                                <select
                                                    className="border-1 form-select"
                                                    onChange={(e) => { setAccount({ ...account, gender: e.target.value }) }}
                                                >
                                                    <option value="Male" selected={account.gender == 'Male'}>Male</option>
                                                    <option value="Female" selected={account.gender == 'Female'}>Female</option>
                                                </select>
                                            </div>
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-phone fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input type="number" className="form-control hidden-number-input" placeholder='Phone number' value={account.phone_number} onChange={e => setAccount({ ...account, phone_number: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input type="password" id="form3Example4c" className="form-control" placeholder='Password' value={account.password} onChange={e => setAccount({ ...account, password: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input type="password" id="form3Example4cd" className="form-control" placeholder='Repeat your password' value={alterPassword} onChange={e => setAlterPassword(e.target.value)} />
                                                </div>
                                            </div>

                                            {role == 'Admin' && <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-user-gear fa-lg me-3 fa-fw"></i>
                                                <select
                                                    className="border-1 form-select"
                                                    onChange={(e) => { setAccount({ ...account, role: e.target.value }) }}
                                                >
                                                    <option value="User" selected={account.role == 'User'}>User</option>
                                                    <option value="Admin" selected={account.role == 'Admin'}>Admin</option>
                                                </select>
                                            </div>}

                                            <div className="d-flex justify-content-center">
                                                <button type="button" className="btn btn-success me-2" onClick={handleRegister}>Sign Up</button>
                                                <button className='btn btn-secondary' onClick={() => { navigate('/'); }}>To Home</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SignUp;