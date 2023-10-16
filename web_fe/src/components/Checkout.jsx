import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { io } from 'socket.io-client';

function Checkout(props) {
    const customer = useState({});
    const [order, setOrder] = useState({});
    const [listCarts, setListCarts] = useState([]);

    const handlePlaceOrder = (e) => {
        let ok = true;
        e.preventDefault();

        if (ok) {
            const asyncDelete = async () => {

            }
            if (window.confirm('Are you sure to place this order ?\nYou can not change after this.'))
                asyncDelete();
        }
    }

    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('checkout', (book) => {

            const bookIndex = listCarts.findIndex((item) => item.book._id === book._id);

            if (bookIndex !== -1) {
                listCarts[bookIndex].quantity += 1;
            } else {
                listCarts.push({ book, quantity: 1 });
            }

            setListCarts([...listCarts]);
        });


        return () => {
            socket.disconnect();
        };
    }, [])

    return (
        <div className="container" style={{ maxWidth: '1200px' }}>
            <div className="row">
                <div className="col col-lg-8 card" style={{ boxShadow: '0 0 3px 3px #ccc' }}>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="h2" style={{ paddingLeft: '0px', color: 'red' }}>New Checkout</th>
                                    <th className='text-center'>Quantity</th>
                                    <th className='text-center'>Price</th>
                                    <th className='text-center'>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listCarts.length > 0 ? listCarts.map(cart => (
                                    <tr key={cart.book._id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img src={`/images/${cart.book.imagePath}`} className="img-fluid rounded-3"
                                                    style={{ maxWidth: '80px' }} alt="book-cover" />
                                                <div className="flex-column ms-4 col-lg-8">
                                                    <NavLink style={{ textDecoration: 'none' }} to={`/book-detail/${cart.book._id}`}>
                                                        <p className="mb-2 text-black" style={{ fontWeight: '500' }}>{cart.book.title}</p>
                                                    </NavLink>
                                                    <p className="mb-0 text-muted" style={{ fontSize: '12px' }} >{cart.book.author}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="align-middle col-lg-1 text-center" style={{ fontWeight: 500 }}>
                                            <p className='mb-0'>{cart.quantity}</p>
                                        </td>
                                        <td className="align-middle col-lg-2 text-center">
                                            <p className="mb-0" style={{ fontWeight: 500 }}>
                                                {`${(cart.book.price * cart.quantity).toLocaleString()} vnđ`}
                                            </p>
                                        </td>
                                        <td className="align-middle col-lg-1">
                                            <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                                                <div className="text-center" style={{ width: '100%' }}>
                                                    <i className="fa-regular fa-trash-can fa-lg trash-can-icon"></i>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )) : <td><h3>Nothing here...</h3></td>}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col col-lg-4">
                    <div className="row d-flex">
                        <div className="col mb-4 mb-lg-0">
                            <div className="card mb-3" style={{ boxShadow: '5px 5px 5px #888888', background: '#ccc' }}>
                                <div className="row g-0">
                                    <div className="col-md-4 gradient-custom text-center text-white">
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                            alt="Avatar" className="img-fluid my-5" style={{ width: '80px' }} />
                                        <h5>Marie Horwitz</h5>
                                        <p>Web Designer</p>
                                        <i className="far fa-edit mb-5"></i>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body p-4">
                                            <h6>Information</h6>
                                            <hr className="mt-0 mb-4" />
                                            <div className="row pt-1">
                                                <div className="col-6 mb-3">
                                                    <h6>Email</h6>
                                                    <p className="text-muted">info@example.com</p>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6>Phone</h6>
                                                    <p className="text-muted">123 456 789</p>
                                                </div>
                                            </div>
                                            <h6>Projects</h6>
                                            <hr className="mt-0 mb-4" />
                                            <div className="row pt-1">
                                                <div className="col-6 mb-3">
                                                    <h6>Recent</h6>
                                                    <p className="text-muted">Lorem ipsum</p>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6>Most Viewed</h6>
                                                    <p className="text-muted">Dolor sit amet</p>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-start">
                                                <a href="#!"><i className="fab fa-facebook-f fa-lg me-3"></i></a>
                                                <a href="#!"><i className="fab fa-twitter fa-lg me-3"></i></a>
                                                <a href="#!"><i className="fab fa-instagram fa-lg"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;