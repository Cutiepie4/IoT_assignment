import React, { useEffect, useState } from 'react';
import { find_all_user } from '../services/API';

function UserList(props) {

    const [listUsers, setListUsers] = useState([]);
    const [tab, setTab] = useState('User');

    useEffect(() => {
        const asyncFunction = async () => {
            const usersData = await find_all_user();
            setListUsers(usersData);
        }
        asyncFunction();
    }, [])

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <div className="main-box clearfix">
                        <div className="table-responsive">
                            <table className="table user-list">
                                <thead>
                                    <tr>
                                        <th><span className='hover-red' onClick={() => setTab('User')}>User</span> <span onClick={() => setTab('Admin')} className='hover-red'>Admin</span></th>
                                        <th><span>Created</span></th>
                                        <th className="text-center"><span>Status</span></th>
                                        <th><span>Phone</span></th>
                                        <th>&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listUsers.length > 0 && listUsers.filter(item => item.role == tab).map(item => (
                                        <tr key={item._id}>
                                            <td>
                                                <img src="https://s3.ap-southeast-2.amazonaws.com/cdn.greekherald.com.au/wp-content/uploads/2020/07/05194617/default-avatar.png" alt="avatar" />
                                                <a style={{ textDecoration: 'none', color: 'black' }} href="#" className="user-link">{item.name}</a>
                                                <span className="user-subhead">{item.role}</span>
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
                                            <td style={{ width: '20%' }}>
                                                <a href="#" className="table-link">
                                                    <span className="fa-stack">
                                                        <i className="fa fa-square fa-stack-2x"></i>
                                                        <i className="fa fa-coins fa-stack-1x fa-inverse"></i>
                                                    </span>
                                                </a>
                                                <a href="#" className="table-link">
                                                    <span className="fa-stack">
                                                        <i className="fa fa-square fa-stack-2x"></i>
                                                        <i className="fa fa-pencil fa-stack-1x fa-inverse"></i>
                                                    </span>
                                                </a>
                                                <a href="#" className="table-link danger">
                                                    <span className="fa-stack">
                                                        <i className="fa fa-square fa-stack-2x"></i>
                                                        <i className="fa fa-trash-can fa-stack-1x fa-inverse"></i>
                                                    </span>
                                                </a>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                        {/* <ul className="pagination pagination-sm pull-right">
                            <li className="page-item active" aria-current="page">
                                <span className="page-link">1</span>
                            </li>
                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                            <li className="page-item"><a className="page-link" href="#">3</a></li>
                        </ul> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserList;