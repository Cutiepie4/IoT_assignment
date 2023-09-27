import React from 'react';
import Rating from 'react-rating';
import { NavLink } from 'react-router-dom';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

function HomeBook(props) {
    const { listBooks } = props;
    return (
        listBooks.map(book => (
            <div key={book.id} className="book-card" >
                <div className="content-wrapper">
                    <img className="book-card-img" src={`/images/${book.imagePath}`} alt="book-cover" />
                    <NavLink to={`/book-detail/${book._id}`} style={{ textDecoration: 'none' }}>
                        <div className="card-content">
                            <div className="book-name">{book.title}</div>
                            <div className="book-by">by {book.author}</div>
                            <div className="rate">
                                <Rating
                                    initialRating={book.rating}
                                    emptySymbol={<FaStar className="star-empty" />}
                                    fullSymbol={<FaStar className="star-full" />}
                                    halfSymbol={<FaStarHalfAlt className="star-half" />}
                                    readonly={true}
                                />
                                <span className="book-voters card-vote">{book.voters} voters</span>
                            </div>
                            <div className="book-sum card-sum">{book.description}</div>
                        </div>
                    </NavLink>
                </div>
            </div>
        ))
    );
}

export default HomeBook;