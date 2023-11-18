import React from 'react';
import Rating from 'react-rating';
import { NavLink } from 'react-router-dom';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

function HomeBook(props) {
    const { listBooks } = props;
    return (
        listBooks.map(book => (
            <div key={book._id} className="book-card" >
                <div className="content-wrapper result-item">
                    <img className="book-card-img" src={`/images/${book.imagePath}`} alt="book-cover" />
                    <NavLink to={`/book-detail/${book._id}`} style={{ textDecoration: 'none' }}>
                        <div className="card-content">
                            <div className="book-name">
                                {book.title}
                                {book.discount > 0 && (
                                    <img
                                        src="./sale-icon.png"
                                        alt="sale-icon"
                                        className='flickering-icon'
                                        style={{
                                            maxWidth: '100%',
                                            height: '1em',  // Adjust the height to match the text size
                                            verticalAlign: 'middle',
                                            marginLeft: '8px', // Add some spacing
                                        }}
                                    />
                                )}
                            </div>


                            <div className="book-by">by {book.author}</div>
                            <div className="rate">
                                <Rating
                                    initialRating={book.overall_rating}
                                    emptySymbol={<FaStar className="star-empty" />}
                                    fullSymbol={<FaStar className="star-full" />}
                                    halfSymbol={<FaStarHalfAlt className="star-half" />}
                                    readonly={true}
                                />
                                <span className="book-voters card-vote">{book.num_ratings} voters</span>
                            </div>
                            <div id='description' className="book-sum card-sum">{book.description}</div>
                        </div>
                    </NavLink>
                </div>
            </div>
        ))
    );
}

export default HomeBook;