import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { io } from 'socket.io-client';

function Checkout(props) {
    const username = "abc";
    const [order, setOrder] = useState({});
    const [listCarts, setListCarts] = useState([]);

    const handlePlaceOrder = (e) => {
        let ok = true;
        e.preventDefault();

        if (ok) {
            const asyncDelete = async () => {

            }
            if (window.confirm('Are you sure to place this order ?\nYou can not change after this.')) asyncDelete();
        }
    }

    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('add-to-cart', (book) => {
            setListCarts(prev => [...prev, book]);
        });

        return () => {
            socket.disconnect();
        };
    }, [])

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
                                {listCarts.length > 0 ? listCarts.map(book => (
                                    <tr key={book._id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                {/* <img src={require(`../assets/images/${book.book.imagePath}`)} className="img-fluid rounded-3"
                                                    style={{ maxWidth: '80px' }} alt="Book-cover" /> */}
                                                <div className="flex-column ms-4 col-lg-8">
                                                    <NavLink style={{ textDecoration: 'none' }} to={`/book/${book._id}`}>
                                                        <p className="mb-2 text-black" style={{ fontWeight: '500' }}>{book.title}</p>
                                                    </NavLink>
                                                    <p className="mb-0 text-muted" style={{ fontSize: '12px' }} >{book.author}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="align-middle text-center" style={{ fontWeight: 500 }}>
                                            <p className='mb-0'>{book.quantity && book.quantity}</p>
                                        </td>
                                        <td className="align-middle col-lg-1 text-center">
                                            <p className="mb-0" style={{ fontWeight: 500 }}>
                                                {book.price && `${(book.price * book.quantity).toLocaleString()} vnđ`}
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
                                )) : <h3>Nothing here...</h3>}
                            </tbody>
                        </table>
                    </div>


                </div>
            </div>
        </div>
    );
}

export default Checkout;