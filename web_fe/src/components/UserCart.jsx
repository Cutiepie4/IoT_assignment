import React from 'react';
import { useEffect, useState } from 'react';
import { NavLink, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';

function UserCart() {

    const [orderItems, setOrderItems] = useOutletContext();
    const [order, setOrder] = useState({ paymentStatus: 'Credit card', orderStatus: 'Pending' });
    const [deliveryInfo, setDeliveryInfo] = useState({});

    const checkEmptyInput = (text) => {
        if (!text || text.trim().length == 0) {
            return false;
        }
        return true;
    }

    const handlePlaceOrder = (e) => {
        let ok = true;
        e.preventDefault();
        if (!checkEmptyInput(order.name)) {
            ok = false;
            toast.info("Enter receiver's name")
        }
        if (!checkEmptyInput(order.phoneNumber)) {
            ok = false;
            toast.info('Phone number is missing.')
        }
        if (!checkEmptyInput(order.address)) {
            ok = false;
            toast.info('Address is missing.')
        }

        if (ok) {
            if (window.confirm('Are you sure to place this order ?\nYou can not change after this.')) {
                toast.success('Your order is placed.');
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
                                    <th className="h2">Shopping Cart</th>
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

                    {orderItems ?
                        <div className="card shadow-2-strong mb-5 mb-lg-5" style={{ borderRadius: '16px', margin: '0 -8px' }}>
                            <div className="card-body p-4">
                                <div className="row">
                                    <div className="col-lg-3 mb-4 mb-md-0">
                                        <div className="d-flex flex-row pb-3">
                                            <div className="d-flex align-items-center pe-2">
                                                <input className="form-check-input" type="radio" value="Credit card" checked={order.paymentStatus === 'Credit card'} onChange={e => { setOrder({ ...order, paymentStatus: e.target.value }); }} />
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
                                                <input className="form-check-input" type="radio" value="Cash" checked={order.paymentStatus === 'Cash'} onChange={e => setOrder({ ...order, paymentStatus: e.target.value })} />
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
                                        <div className="row">
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
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-12 col-xl-12">
                                                <div className="form-outline mb-3 mb-xl-4">
                                                    <input type="text" className="form-control" placeholder="eg. 2848 El Caminito Street, Los Angeles" value={deliveryInfo.address} onChange={e => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })} />
                                                    <label className="form-label"><span className='required'>Delivery Address</span></label>
                                                </div>
                                            </div>
                                        </div>

                                        {order.paymentStatus === 'Credit card' && <><div className="row">
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
                                                `${(orderItems.reduce((res, curr) => {
                                                    return res + curr.book.price * curr.quantity;
                                                }, 0)).toLocaleString()} vnđ`
                                            }</p>
                                        </div>

                                        <div className="d-flex justify-content-between" style={{ fontWeight: 500 }}>
                                            <p className="mb-0">Shipping</p>
                                            <p className="mb-0">30.000 vnđ</p>
                                        </div>
                                        <hr className="my-4" />
                                        <div className="d-flex justify-content-between mb-4" style={{ fontWeight: 500 }}>
                                            <p className="mb-2">Total</p>
                                            <p className="mb-2" style={{ color: 'red' }}>{`${(orderItems.reduce((res, curr) => {
                                                return res + curr.book.price * curr.quantity;
                                            }, 0) + 30000).toLocaleString()} vnđ`}</p>
                                        </div>

                                        <button className="btn btn-primary btn-block btn-lg" onClick={handlePlaceOrder}>
                                            <div className="d-flex justify-content-between">
                                                {`Place Order`}
                                            </div>
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

export default UserCart;