import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { find_all_books } from '../services/API';
import HomeBook from './HomeBook';

function Home() {

    const [listBooks, setListBooks] = useState([]);
    const [listBestSellers, setListBestSellers] = useState([]);
    const [activeGenre, setActiveGenre] = useState('All');
    const [showingBooks, setShowingBooks] = useState([]);

    useEffect(() => {
        setShowingBooks(listBooks.filter(book => book.genre === activeGenre));
    }, [activeGenre])

    useEffect(() => {
        const asyncFunction = async () => {
            const res = await find_all_books();
            setListBooks(prev => res);
        }
        asyncFunction();
    }, [])

    return (
        <>
            <div className="main-wrapper">
                <div className="books-of">
                    <div className="week year">
                        <div className="author-title fs-5 mt-3">Book Recommended</div>
                        {listBooks && listBooks.map(book => (
                            <div className="year-book" key={book.id}>
                                <img src={`./images/${book.imagePath}`} alt="book-cover" className="year-book-img" />
                                <div className="year-book-content">
                                    <NavLink style={{ textDecoration: 'none', color: 'black' }} to={`/book-detail/${book._id}`}>
                                        <div className='d-flex'>
                                            <div className="year-book-name me-2">{book.title}</div>
                                            <div className='align-items-center flickering-icon pt-1' style={{ color: 'red', fontSize: '0.6rem' }}>
                                                {book.discount > 0 && (
                                                    <>
                                                        {book.discount}%
                                                        <img
                                                            src="/sale-icon.png"
                                                            alt="sale-icon"
                                                            style={{
                                                                maxWidth: '100%',
                                                                height: '1em', // Adjust the height to match the text size
                                                                verticalAlign: 'middle',
                                                                marginLeft: '3px', // Add some spacing
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </NavLink>
                                    <div className="year-book-author">by {book.author}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="overlay"></div>
                </div>
                <div className="popular-books">
                    <div className="main-menu">
                        <div className="genre">Popular by Genre</div>
                        <div className="book-types d-flex">
                            <div className={`book-type ${activeGenre === 'All' ? 'active' : ''}`} onClick={() => setActiveGenre('All')}>All Genres</div>
                            <div className={`book-type ${activeGenre === 'Action' ? 'active' : ''}`} onClick={() => setActiveGenre('Action')}>Action</div>
                            <div className={`book-type ${activeGenre === 'Fantasy' ? 'active' : ''}`} onClick={() => setActiveGenre('Fantasy')}>Fantasy</div>
                            <div className={`book-type ${activeGenre === 'Romance' ? 'active' : ''}`} onClick={() => setActiveGenre('Romance')}>Romance</div>
                            <div className={`book-type ${activeGenre === 'Historical' ? 'active' : ''}`} onClick={() => setActiveGenre('Historical')}>Historical</div>
                            <div className={`book-type ${activeGenre === 'Comedy' ? 'active' : ''}`} onClick={() => setActiveGenre('Comedy')}>Comedy</div>
                        </div>
                    </div>
                    <div className="book-cards">
                        <HomeBook listBooks={activeGenre === 'All' ? listBooks : showingBooks} />
                    </div>
                </div>
            </div >
        </>
    );
}

export default Home;