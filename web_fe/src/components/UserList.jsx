import React, { useEffect, useState } from 'react';
import { deleteUser, findAllUsers } from '../services/API';
import { Modal } from 'react-bootstrap';
import MemberRegister from './MemberRegister';

function UserList(props) {

    const [listUsers, setListUsers] = useState([]);
    const [tab, setTab] = useState('User');
    const [userId, setUserId] = useState('');
    const [showMemberRegistrationModal, setMemberRegistrationModal] = useState(false);

    const openModal = (id) => {
        setUserId(id);
        setMemberRegistrationModal(true);
    }

    const closeModal = () => {
        setMemberRegistrationModal(false);
    }

    const handleDelete = () => {
        if (window.confirm('Are you sure to delete this user?')) {
            const asyncFunction = async () => {
                await deleteUser(userId);
                setListUsers(listUsers.filter(item => item._id != userId));
                console.log(userId)
            }
            asyncFunction();
        }
    }

    useEffect(() => {
        const asyncFunction = async () => {
            const usersData = await findAllUsers();
            setListUsers(usersData);
        }
        asyncFunction();
    }, [])

    return (
        <div className="container user-list">
            <div className="row">
                <div className="col-lg-12">
                    <div className="main-box clearfix">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>
                                            <span className='hover-red me-2' onClick={() => setTab('User')} style={tab == 'User' ? { color: 'red' } : {}}>User</span>
                                            <span className='hover-red' onClick={() => setTab('Admin')} style={tab == 'Admin' ? { color: 'red' } : {}}>Admin</span>
                                        </th>
                                        <th><span>Created</span></th>
                                        <th className="text-center"><span>Status</span></th>
                                        <th><span>Phone</span></th>
                                        <th><span>Action</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listUsers.length > 0 && listUsers.filter(item => item.role == tab).map(item => (
                                        <tr key={item._id} onClick={() => setUserId(item._id)}>
                                            <td>
                                                <img src="https://s3.ap-southeast-2.amazonaws.com/cdn.greekherald.com.au/wp-content/uploads/2020/07/05194617/default-avatar.png" alt="avatar" />
                                                <a style={{ textDecoration: 'none', color: 'black' }} href="#" className="user-link">{item.name}</a>
                                                <span className="user-subhead">{item.username}</span>
                                            </td>
                                            <td>
                                                {item.date_created}
                                            </td>
                                            <td className="text-center">
                                                <span className="label label-default" style={item.status == 'active' ? { color: 'green' } : { color: 'red' }}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td>
                                                <a style={{ textDecoration: 'none', color: 'black' }} href="#">{item.phone_number}</a>
                                            </td>
                                            <td>
                                                <div className='d-flex'>
                                                    <div className="table-link" style={{ cursor: 'pointer' }}>
                                                        <span className="fa-stack">
                                                            <i className="fa fa-square fa-stack-2x"></i>
                                                            <i className="fa fa-pencil fa-stack-1x fa-inverse"></i>
                                                        </span>
                                                    </div>
                                                    <div className="table-link" onClick={() => { openModal(item._id); }} style={{ cursor: 'pointer' }}>
                                                        <span className="fa-stack">
                                                            <i className="fa fa-square fa-stack-2x"></i>
                                                            <i className=" fa fa-solid fa-id-card-clip fa-stack-1x fa-inverse"></i>
                                                        </span>
                                                    </div>
                                                    <div className="table-link danger" onClick={handleDelete} style={{ cursor: 'pointer' }}>
                                                        <span className="fa-stack">
                                                            <i className="fa fa-square fa-stack-2x"></i>
                                                            <i className="fa fa-trash-can fa-stack-1x fa-inverse"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <button className='btn btn-lg btn-success' onClick={() => { window.location.href = "/sign-up" }}>Create account</button>
                </div>
            </div>
            <Modal show={showMemberRegistrationModal} onHide={closeModal} dialogClassName='modal-xl'>
                <Modal.Header>
                    <h3>Member Register</h3>
                </Modal.Header>
                <Modal.Body>
                    <MemberRegister userId={userId} />
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default UserList;