import React from 'react';
import { useEffect, useState } from 'react';
import { NavLink, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { checkout } from '../services/API';
import { enableRFIDSingle } from '../services/API';
import { formatDate } from '../services/API';

function Checkout() {
    const [payment, setPayment] = useState({ type: 'Credit card' });
    // const [deliveryInfo, setDeliveryInfo] = useState({});

    const [orderItems, setOrderItems] = useState([]);
    const [user, setUser] = useState({});
    const [discountPrice, setDiscountPrice] = useState(0);
    const [originalPrice, setOriginalPrice] = useState(0);

    useEffect(() => {
        if (Object.keys(user).length == 0) {
            setDiscountPrice(0);
        }
        else {
            setDiscountPrice(orderItems.reduce((res, curr) => {
                return Math.round(res + curr.book.price * curr.quantity * curr.book.discount / 100);
            }, 0));
        }
        setOriginalPrice(orderItems.reduce((res, curr) => {
            return Math.round(res + curr.book.price * curr.quantity);
        }, 0))
    }, [orderItems, user])

    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('checkout', (payload) => {
            const bookIndex = orderItems.findIndex((orderItem) => orderItem.book._id === payload.book._id);

            if (bookIndex !== -1) {
                if (!orderItems[bookIndex].copy_ids instanceof Set) {
                    orderItems[bookIndex].copy_ids = new Set();
                }
                orderItems[bookIndex].copy_ids.add(payload.copy_id);
                orderItems[bookIndex].quantity = orderItems[bookIndex].copy_ids.size
            } else {
                orderItems.push({ book: payload.book, quantity: 1, copy_ids: new Set([payload.copy_id]) });
            }

            setOrderItems([...orderItems]);
        });

        socket.on('checkout-user', (user) => {
            setUser(prev => user);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const checkEmptyInput = (text) => {
        if (!text || text.trim().length == 0) {
            return false;
        }
        return true;
    }

    const handleCheckout = (e) => {
        let ok = true;
        e.preventDefault();

        if (ok) {
            const asyncFunction = async () => {
                const flag = await checkout({
                    user, orderItems, 'original_cost': originalPrice - discountPrice, 'discount_cost': discountPrice
                })

                if (flag) {
                    setUser({});
                    setOrderItems([]);
                    toast.success('Your order is placed.');
                }
            }
            if (window.confirm('Are you sure to place this order ?')) {
                asyncFunction();
            }
        }
    }

    return (
        <div className="container" style={{ maxWidth: '1000px' }}>
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="h2">Checkout</th>
                                    <th className='text-center'>Discount</th>
                                    <th className='text-center'>Quantity</th>
                                    <th className='text-center'>Price</th>
                                    <th className='text-center'>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderItems && orderItems.map(orderItem => (
                                    <tr key={orderItem.book._id}>
                                        <th>
                                            <div className="d-flex align-items-center">
                                                <img src={`./images/${orderItem.book.imagePath}`} className="img-fluid rounded-3"
                                                    style={{ maxWidth: '80px' }} alt="Book-cover" />
                                                <div className="flex-column ms-4 col-lg-8">
                                                    <NavLink style={{ textDecoration: 'none' }} to={`/book-detail/${orderItem.book.id}`}><p className="mb-2 text-black" style={{ fontWeight: '500' }}>{orderItem.book.title}</p></NavLink>
                                                    <p className="mb-0 text-muted" style={{ fontSize: '12px' }} >{orderItem.book.author}</p>
                                                </div>
                                            </div>
                                        </th>
                                        <td className="align-middle text-center" style={{ fontWeight: 500 }}>
                                            <p className='mb-0'>{orderItem.book.discount}%</p>
                                        </td>
                                        <td className="align-middle text-center" style={{ fontWeight: 500 }}>
                                            <p className='mb-0'>{orderItem.quantity}</p>
                                        </td>
                                        <td className="align-middle col-lg-1 text-center">
                                            <p className="mb-0" style={{ fontWeight: 500 }}>
                                                {`${(orderItem.book.price * orderItem.quantity).toLocaleString()} vnđ`}
                                            </p>
                                        </td>
                                        <td className="align-middle">
                                            <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                                                <div onClick={() => { }} className="text-center" style={{ width: '100%' }}>
                                                    <i className="fa-regular fa-trash-can fa-lg trash-can-icon"></i>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <hr />
                    <div className="col">
                        <div className="row d-flex">
                            <div className="col mb-4 mb-lg-0">
                                <div className="card mb-3">
                                    {Object.keys(user).length > 0 ? (
                                        <div className="row g-0 align-items-center justify-content-center">
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
                                                            <h6>Recent Purchase</h6>
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
                                        <button className='btn btn-outline-dark mb-2' onClick={enableRFIDSingle}>Scan</button>
                                    </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    {orderItems ?
                        <div className="card shadow-2-strong mb-5 mb-lg-5" style={{ borderRadius: '16px', margin: '0 -8px' }}>
                            <div className="card-body p-4">
                                <div className="row">
                                    <div className="col-lg-3 mb-4 mb-md-0">
                                        <div className="d-flex flex-row pb-3">
                                            <div className="d-flex align-items-center pe-2">
                                                <input className="form-check-input" type="radio" value="Credit card" checked={payment.type === 'Credit card'} onChange={e => { setPayment({ ...payment, type: e.target.value }); }} />
                                            </div>
                                            <div className="rounded border w-100 p-3">
                                                <p className="d-flex align-items-center mb-0">
                                                    <i className="fa-regular fa-credit-card fa-lg me-2"></i>Credit
                                                    Card
                                                </p>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-row pb-3">
                                            <div className="d-flex align-items-center pe-2">
                                                <input className="form-check-input" type="radio" value="Cash" checked={payment.type === 'Cash'} onChange={e => setPayment({ ...payment, type: e.target.value })} />
                                            </div>
                                            <div className="rounded border w-100 p-3">
                                                <p className="d-flex align-items-center mb-0">
                                                    <i className="fa-solid fa-money-bill-wave fa-xl me-2"></i>
                                                    Cash
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        {/* <div className="row">
                                            <div className="col-lg-6 col-xl-6">
                                                <div className="form-outline mb-3 mb-xl-4">
                                                    <input type="text" className="form-control" placeholder="What's the name" value={deliveryInfo.name} onChange={e => setDeliveryInfo({ ...deliveryInfo, name: e.target.value })} />
                                                    <label className="form-label"><span className='required'>Receiver's Name</span> <span style={{ color: 'red' }}>{deliveryInfo.name}</span></label>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-xl-6">
                                                <div className="form-outline mb-3 mb-xl-4">
                                                    <input type="number" className="form-control" placeholder="(+84) XX-XXX-XXX" value={deliveryInfo.phoneNumber} onChange={e => setDeliveryInfo({ ...deliveryInfo, phoneNumber: e.target.value })} />
                                                    <label className="form-label"><span className='required'>Receiver's phone number</span></label>
                                                </div>
                                            </div>
                                        </div> */}

                                        {/* <div className="row">
                                            <div className="col-lg-12 col-xl-12">
                                                <div className="form-outline mb-3 mb-xl-4">
                                                    <input type="text" className="form-control" placeholder="eg. 2848 El Caminito Street, Los Angeles" value={deliveryInfo.address} onChange={e => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })} />
                                                    <label className="form-label"><span className='required'>Delivery Address</span></label>
                                                </div>
                                            </div>
                                        </div> */}

                                        {payment.type === 'Credit card' && <><div className="row">
                                            <div className="col-lg-6 col-xl-6">
                                                <div className="form-outline mb-3 mb-xl-4">
                                                    <input type="text" className="form-control"
                                                        placeholder="Name" />
                                                    <label className="form-label">Name on card</label>
                                                </div>
                                            </div>

                                            <div className="col-lg-6 col-xl-6">
                                                <div className="form-outline mb-3 mb-xl-4">
                                                    <input type="text" className="form-control" placeholder="MM/YY" />
                                                    <label className="form-label">Expiration</label>
                                                </div>
                                            </div>
                                        </div>

                                            <div className="row">
                                                <div className="col-lg-6 col-xl-6">
                                                    <div className="form-outline mb-3 mb-xl-4">
                                                        <input type="text" className="form-control"
                                                            placeholder="1111 2222 3333 4444" />
                                                        <label className="form-label" >Card Number</label>
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-xl-6">
                                                    <div className="form-outline mb-3 mb-xl-4">
                                                        <input type="password" className="form-control"
                                                            placeholder="&#9679;&#9679;&#9679;" />
                                                        <label className="form-label">Cvv</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </>}
                                    </div>

                                    <div className="col-lg-3">
                                        <div className="d-flex justify-content-between" style={{ fontWeight: 500 }}>
                                            <p className="mb-2">Subtotal</p>
                                            <p className="mb-2" style={{ color: 'red' }}>{
                                                `${originalPrice.toLocaleString()} vnđ`
                                            }</p>
                                        </div>

                                        <div className="d-flex justify-content-between" style={{ fontWeight: 500 }}>
                                            <p className="mb-0">Discount Price</p>
                                            <p className="mb-0">{discountPrice.toLocaleString()} vnđ</p>
                                        </div>
                                        <hr className="my-4" />
                                        <div className="d-flex justify-content-between mb-4" style={{ fontWeight: 500 }}>
                                            <p className="mb-2">Total</p>
                                            <p className="mb-2" style={{ color: 'red' }}>{(originalPrice - discountPrice).toLocaleString()} vnđ</p>
                                        </div>

                                        <button className="btn btn-primary btn-block btn-lg" onClick={handleCheckout}>
                                            Checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div> : <h3>Nothing in your cart.</h3>}
                </div>
            </div>
        </div>
    );
}

export default Checkout;