import React, { useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { findUser, updateUser } from '../services/API';

function UserDetail(props) {
    const { role, userId } = props;
    const [account, setAccount] = useState({ role: 'User' });

    const validate = () => {
        if (checkEmptyInput(account.username) || checkEmptyInput(account.name) || checkEmptyInput(account.password) || checkEmptyInput(account.phone_number)) {
            toast.error('Please do not leave any field blank.')
            return false;
        }
        return true;
    }

    const checkEmptyInput = (text) => {
        return !text || text.trim().length == 0;
    }

    const handleUpdate = () => {
        if (validate() && window.confirm('Are you sure to update this user info ?')) {
            updateUser(account);
        }
    }

    useEffect(() => {
        const asyncFunction = async () => {
            const userData = await findUser(userId);
            setAccount(userData);
            console.log(userData)
        }
        asyncFunction();
    }, []);

    return (
        <div className="row justify-content-center pb-5">
            <div className="col-md-10 col-lg-6 col-xl-5">
                <p className="text-center h2 fw-bold mb-3 mt-3">User Detail</p>
                <div>
                    <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-id-badge fa-lg me-3 fa-fw" />
                        <div className="form-outline flex-fill mb-0">
                            <input disabled type="text" className="form-control" placeholder='Username' value={account.username} onChange={e => setAccount({ ...account, username: e.target.value })} />
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
                        <button type="button" className="btn btn-success me-2" onClick={handleUpdate}>Update</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDetail;