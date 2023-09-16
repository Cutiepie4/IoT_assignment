import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Checkout(props) {
    const username = "abc";
    const listCarts = [];
    const [order, setOrder] = useState({ paymentStatus: 'Credit card', orderStatus: 'Pending' });

    const [name, setName] = useState('');
    const [phoneNumberMessage, setPhoneNumberMessage] = useState('');
    const [addressMessage, setAddressMessage] = useState('');

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
            setName('Required');
        }
        if (!checkEmptyInput(order.phoneNumber)) {
            ok = false;
            setPhoneNumberMessage('Required');
        }
        if (!checkEmptyInput(order.address)) {
            ok = false;
            setAddressMessage('Required');
        }

        if (ok) {
            const asyncDelete = async () => {

            }
            if (window.confirm('Are you sure to place this order ?\nYou can not change after this.')) asyncDelete();
        }
    }

    useEffect(() => {
        setOrder({ ...order, user: { username }, listOrderBooks: listCarts });
    }, [username, listCarts]);

    return (
        <div className="container" style={{ maxWidth: '1000px' }}>
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="h2">New Checkout</th>
                                    <th className='text-center'>Quantity</th>
                                    <th className='text-center'>Price</th>
                                    <th className='text-center'>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listCarts ? listCarts.map(cart => (
                                    <tr key={cart.book.id}>
                                        <th>
                                            <div className="d-flex align-items-center">
                                                {/* <img src={require(`../assets/images/${cart.book.imagePath}`)} className="img-fluid rounded-3"
                                                    style={{ maxWidth: '80px' }} alt="Book-cover" /> */}
                                                <div className="flex-column ms-4 col-lg-8">
                                                    <NavLink style={{ textDecoration: 'none' }} to={`/book-detail/${cart.book.id}`}><p className="mb-2 text-black" style={{ fontWeight: '500' }}>{cart.book.title}</p></NavLink>
                                                    <p className="mb-0 text-muted" style={{ fontSize: '12px' }} >{cart.book.author}</p>
                                                </div>
                                            </div>
                                        </th>
                                        <td className="align-middle text-center" style={{ fontWeight: 500 }}>
                                            <p className='mb-0'>{cart.quantity}</p>
                                        </td>
                                        <td className="align-middle col-lg-1 text-center">
                                            <p className="mb-0" style={{ fontWeight: 500 }}>
                                                {`${(cart.book.price * cart.quantity).toLocaleString()} vnđ`}
                                            </p>
                                        </td>
                                        <td className="align-middle">
                                            <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                                                <div className="text-center" style={{ width: '100%' }}>
                                                    <i className="fa-regular fa-trash-can fa-lg trash-can-icon"></i>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )) : <h3>Loading...</h3>}
                            </tbody>
                        </table>
                    </div>

                    {listCarts.length > 0 ?
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

                                    <div className="col-lg-3">
                                        <div className="d-flex justify-content-between" style={{ fontWeight: 500 }}>
                                            <p className="mb-2">Subtotal</p>
                                            <p className="mb-2" style={{ color: 'red' }}>{
                                                `${(listCarts.reduce((res, curr) => {
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
                                            <p className="mb-2" style={{ color: 'red' }}>{`${(listCarts.reduce((res, curr) => {
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

export default Checkout;