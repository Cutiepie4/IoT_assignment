import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { find_all_books } from '../services/API';

function Nav() {
    const [count, setCount] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [filteredBook, setFilteredBook] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [listBooks, setListBooks] = useState([]);
    const [role, setRole] = useState('ADMIN');
    const [isLoggedIn, setLogIn] = useState(true);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const asyncFunction = async () => {
            const booksData = await find_all_books();
            setListBooks(booksData);
        };
        asyncFunction();
    }, [])

    useEffect(() => {
        if (keyword.trim.length == 0) {
            setFilteredBook([]);
        }
        if (listBooks.length > 0 && keyword.trim().length > 0) {
            setFilteredBook(listBooks.filter(book => book.title.toLowerCase().includes(keyword.toLowerCase())));
        }
    }, [keyword])

    return (
        <>
            <div className="header">
                <div className="browse">
                    <NavLink style={{ textDecoration: 'none', color: '#8b939c' }} to={'/'}><div className="header-title">book<span>store</span></div></NavLink>
                    <div className="search-bar">
                        <div className='d-flex align-items-center'>
                            <input type="text"
                                placeholder="Search Book" value={keyword}
                                onChange={e => setKeyword(e.target.value)}
                                onFocus={() => setIsFocused(true)} />
                            <i className="fa-solid fa-xmark fa-xs hover-red" onClick={() => setKeyword('')}></i>
                        </div>
                        {filteredBook && filteredBook.length > 0 && isFocused ?
                            <div className="dropdown card" >
                                {filteredBook && filteredBook.map(book => (
                                    <NavLink key={book._id} className={'text-muted'}
                                        to={`/book-detail/${book._id}`} style={{ textDecoration: 'none' }}>
                                        <div className='result-item' onClick={() => { setIsFocused(false) }}>
                                            {book.title}
                                        </div>
                                    </NavLink>))
                                }
                            </div>
                            : keyword.length > 0 && isFocused &&
                            <div className='dropdown'>
                                <div className="result-item">No matching found.</div>
                            </div>
                        }
                    </div>
                </div>
                <div className="profile">
                    {count > 0 && <div className='notification-icon'>{count}</div>}
                    <NavLink style={{ textDecoration: 'none', color: '#8b939c' }} to={'/checkout'}>
                        <div className="user-profile pe-3">
                            <i className="fa-solid fa-cart-shopping fa-lg pe-2"></i>
                            Checkout
                        </div>
                    </NavLink>
                    <div className="profile-menu">
                        <i className="fa-solid fa-user fa-lg p-2"></i>
                        {username ? username : 'Login'}
                        <ul className="dropdown">
                            {isLoggedIn ? (<li className='border-bottom'>
                                <NavLink to={'#'}>Manage user</NavLink>
                            </li>) : (<li><NavLink to="/login">Login</NavLink></li>)}
                            {role === 'ADMIN' && (<li className='border-bottom'><NavLink to='/books'>Book Storage</NavLink></li>)}
                            {role === 'ADMIN' && (<li className='border-bottom'><NavLink to='/orders'>Orders</NavLink></li>)}
                            {role === 'USER' && (<li className='border-bottom'><NavLink to='/user-orders'>Your Orders</NavLink></li>)}
                            {isLoggedIn && (<li className='border-bottom'><a href='#'>Logout</a></li>)}
                        </ul>
                    </div>
                </div>
            </div >

            <Outlet />
        </>
    );
}

export default Nav;