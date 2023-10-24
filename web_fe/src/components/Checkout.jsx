import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { io } from 'socket.io-client';
import { checkout, enableRFIDSingle, formatDate } from '../services/API';

function Checkout() {
    const [items, setItems] = useState([]);
    const [user, setUser] = useState({});
    const [discountPrice, setDiscountPrice] = useState(0);
    const [originalPrice, setOriginalPrice] = useState(0);

    const handleCheckout = () => {
        const asyncFunction = async () => {
            const flag = await checkout({
                user, items, 'total_cost': originalPrice - discountPrice
            })

            if (flag) {
                setUser({});
                setItems([]);
            }
        }
        if (window.confirm('Are you sure to place this order ?')) {
            asyncFunction();
        }
    }

    useEffect(() => {
        if (Object.keys(user).length == 0) {
            setDiscountPrice(0);
        }
        else {
            setDiscountPrice(items.reduce((res, curr) => {
                return Math.round(res + curr.book.price * curr.quantity * curr.book.discount / 100);
            }, 0));
        }
        setOriginalPrice(items.reduce((res, curr) => {
            return Math.round(res + curr.book.price * curr.quantity);
        }, 0))
    }, [items, user])

    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('checkout', (book) => {
            const bookIndex = items.findIndex((orderItem) => orderItem.book._id === book._id);

            if (bookIndex !== -1) {
                items[bookIndex].quantity += 1;
            } else {
                items.push({ book, quantity: 1 });
            }

            setItems([...items]);
        });

        socket.on('checkout-user', (user) => {
            setUser(prev => user);
        });

        return () => {
            socket.disconnect();
        };
    }, [])

    return (
        <div className="container" style={{ maxWidth: '1400px' }}>
            <div className="row d-flex">
                <div className="col col-lg-8 card" style={{ boxShadow: '0 0 3px 3px #ccc' }}>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="h2" style={{ paddingLeft: '0px', color: 'red' }}>New Checkout</th>
                                    <th className='text-center'>Discount</th>
                                    <th className='text-center'>Quantity</th>
                                    <th className='text-center'>Price</th>
                                    <th className='text-center'>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length > 0 && items.map(orderItem => (
                                    <tr key={orderItem.book._id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img src={`/images/${orderItem.book.imagePath}`} className="img-fluid rounded-3"
                                                    style={{ maxWidth: '80px' }} alt="book-cover" />
                                                <div className="flex-column ms-4 col-lg-8">
                                                    <NavLink style={{ textDecoration: 'none' }} to={`/book-detail/${orderItem.book._id}`}>
                                                        <p className="mb-2 text-black" style={{ fontWeight: '500' }}>{orderItem.book.title}</p>
                                                    </NavLink>
                                                    <p className="mb-0 text-muted" style={{ fontSize: '12px' }} >{orderItem.book.author}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="align-middle col-lg-1 text-center" style={{ fontWeight: 500 }}>
                                            <p className='mb-0'>{(orderItem.book.discount > 0 && Object.keys(user).length > 0) ? `${orderItem.book.discount}%` : 'Không'}</p>
                                        </td>
                                        <td className="align-middle col-lg-1 text-center" style={{ fontWeight: 500 }}>
                                            <p className='mb-0'>{orderItem.quantity}</p>
                                        </td>
                                        <td className="align-middle col-lg-2 text-center">
                                            <p className="mb-0" style={{ fontWeight: 500 }}>
                                                {`${(orderItem.book.price * orderItem.quantity).toLocaleString()} vnđ`}
                                            </p>
                                        </td>
                                        <td className="align-middle col-lg-1 text-center">
                                            <i className="fa-regular fa-trash-can fa-lg trash-can-icon"></i>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col col-lg-4">
                    <div className="row d-flex">
                        <div className="col mb-4 mb-lg-0">
                            <div className="card mb-3" style={{ boxShadow: '5px 5px 5px #888888', background: '#faf9ba', minHeight: '300px' }}>
                                {Object.keys(user).length > 0 ? (
                                    <div className="row g-0">
                                        <div className="col-md-4 gradient-custom text-center">
                                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                                alt="Avatar" className="img-fluid my-5" style={{ width: '80px' }} />
                                            <h5>{user.name}</h5>
                                            <p>{user.gender}</p>
                                            <p>{user.role}</p>
                                            {/* <i className="far fa-edit mb-5"></i> */}
                                        </div>
                                        <div className="col-md-8">
                                            <div className="card-body p-4">
                                                <h5 style={{ color: 'red' }}>Information</h5>
                                                <hr className="mt-0 mb-4" />
                                                <div className="row pt-1">
                                                    <div className="col-6 mb-3">
                                                        <h6>Member ID</h6>
                                                        <p className="text-muted">{user.member_id}</p>
                                                    </div>
                                                    <div className="col-6 mb-3">
                                                        <h6>Phone</h6>
                                                        <p className="text-muted">{user.phone_number}</p>
                                                    </div>
                                                </div>
                                                <hr className="mt-0 mb-4" />
                                                <div className="row pt-1">
                                                    <div className="col-6 mb-3">
                                                        <h6>Recent</h6>
                                                        <p className="text-muted">{user.recent_purchase}</p>
                                                    </div>
                                                    <div className="col-6 mb-3">
                                                        <h6>Date Joined</h6>
                                                        <p className="text-muted">{formatDate(user.date_created)}</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-start">
                                                    <button className='btn btn-outline-dark' onClick={enableRFIDSingle}>Scan</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (<div className='d-flex flex-column justify-content-between custom-container' style={{ height: '290px' }}>
                                    <p className='text-muted' style={{ fontStyle: 'italic' }}>Scan member card for discount</p>
                                    <button className='btn btn-outline-dark' onClick={enableRFIDSingle}>Scan</button>
                                </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 card mt-3 p-3">
                    <div className="d-flex justify-content-between" style={{ fontWeight: 500 }}>
                        <p className="mb-2">Original Price</p>
                        <p className="mb-2" style={{ color: 'red' }}>{
                            `${originalPrice.toLocaleString()} vnđ`
                        }</p>
                    </div>

                    <div className="d-flex justify-content-between" style={{ fontWeight: 500 }}>
                        <p className="mb-2">Discount</p>
                        <p className="mb-2" style={{ color: 'red' }}>{
                            `- ${discountPrice.toLocaleString()} vnđ`
                        }</p>
                    </div>
                    <hr className="my-4" />
                    <div className="d-flex justify-content-between mb-4" style={{ fontWeight: 500 }}>
                        <p className="mb-2">Total</p>
                        <p className="mb-2" style={{ color: 'red' }}>{`${(originalPrice - discountPrice).toLocaleString()} vnđ`}</p>
                    </div>

                    <button className="btn btn-success btn-block btn-lg d-flex justify-content-center align-items-center" onClick={handleCheckout}>
                        <h5 className='m-0'>Checkout</h5>
                    </button>
                </div>
            </div>
        </div >
    );
}

export default Checkout;