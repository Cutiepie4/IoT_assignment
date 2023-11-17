import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Rating from 'react-rating';
import { toast } from 'react-toastify';
import ReactLoading from 'react-loading'
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { addComment, addRating, deleteComment, findBook, formatMongoDate, getUserRating, isLoggedIn } from '../services/API';

function BookDetail() {
    const { bookId } = useParams();
    const [expanded, setExpanded] = useState(false);
    const [orderItem, setOrderItem] = useState({ quantity: 1, book: {} });
    const [listComments, setListCommments] = useState([]);
    const [currentComment, setCurrentComment] = useState('');
    const [vote, setVote] = useState(0);
    const [loading, setLoading] = useState(true);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    }

    useEffect(() => {
        const asyncFunction = async () => {
            const bookData = await findBook(bookId);
            setOrderItem({ ...orderItem, book: bookData });
            setListCommments(bookData.comments)
            const userRatingData = await getUserRating(bookId);
            setVote(userRatingData.user_rating);
            setLoading(false);
        }
        asyncFunction();
    }, [bookId])

    const handlePostComment = async () => {
        const newComment = await addComment(bookId, { 'comment': currentComment });
        setListCommments((listComments || []).concat({ ...newComment, 'rating': vote }));
        setCurrentComment('');
    }

    const handleDeleteComment = (commentId) => {
        const asyncFunction = async () => {
            let flag = await deleteComment(bookId, commentId);
            if (flag)
                setListCommments(listComments.filter(comment => comment.comment_id != commentId));
        }
        asyncFunction();
    }

    const handleVoting = async () => {
        await addRating(bookId, { 'rating': vote });
    }

    if (loading) {
        return <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <ReactLoading type={'spin'} color={'green'} />;
        </div>
    }

    return (
        <>
            <div className='container card col-md-12 col-lg-10' style={{ backgroundColor: '#faf9ba' }}>
                <div className="container px-4 px-lg-5 my-5 ">
                    <div className="row gx-4 gx-lg-5 align-items-center">
                        <div className="col-md-4 align-self-start" >
                            <img className="card-img-top mb-5 mb-md-0" src={orderItem.book.imagePath && `/images/${orderItem.book.imagePath}`} alt="book-cover" />
                        </div>
                        <div className="col-md-8">
                            <div className="display-6 mb-3 fw-bolder" style={{ margin: '0 0' }}>
                                {orderItem.book.title}
                            </div>

                            <h3 className="fs-6 mb-3 fw-normal">by {orderItem.book.author}</h3>
                            <Rating
                                className='mb-4'
                                initialRating={orderItem.book.overall_rating}
                                emptySymbol={<FaStar className="star-empty" />}
                                fullSymbol={<FaStar className="star-full" />}
                                halfSymbol={<FaStarHalfAlt className="star-half" />}
                                readonly={true}
                            />
                            <span className="book-voters card-vote">{orderItem.book.num_ratings} voters</span>
                            <p bookId='description' className={`lead fs-6 ${expanded ? 'expanded' : ''} mb-5`} onClick={toggleExpanded}>
                                {orderItem.book.description}
                            </p>

                            <div className="fs-4 mb-2">
                                <span className={orderItem.book.discount > 0 && `text-decoration-line-through text-muted`} style={{ color: 'red' }}>{orderItem.book.price && orderItem.book.price.toLocaleString() + ' vnđ'} </span>
                            </div>
                            <div className='d-flex'>
                                {orderItem.book.discount > 0 && (<div className='fs-4 me-2' style={{ color: 'red' }}>
                                    {(Math.round(orderItem.book.price * (100 - orderItem.book.discount) / 100)).toLocaleString()} vnđ
                                </div>)}
                                <div className='d-flex align-items-center flickering-icon' style={{ color: 'red' }}>
                                    {orderItem.book.discount > 0 && (
                                        <>
                                            {orderItem.book.discount}%
                                            <img
                                                src="/sale-icon.png"
                                                alt="sale-icon"
                                                style={{
                                                    maxWidth: '100%',
                                                    height: '1em',
                                                    verticalAlign: 'middle',
                                                    marginLeft: '3px',
                                                }}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                            {orderItem.book.discount > 0 && <div className='text-muted' style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>
                                <p>The discount applies to member-only.</p>
                            </div>}

                            {/* <div className="d-flex align-items-center mb-3 mt-3">
                                <i className="fa-solid fa-minus me-2 order-quantity" onClick={() => { orderItem.quantity > 1 && setOrderItem({ ...orderItem, quantity: orderItem.quantity - 1 }) }}></i>
                                <div className='btn btn-outline-dark me-2 flex-shrink-0' style={{ minWidth: '40px' }} >
                                    {orderItem.quantity}
                                </div>
                                <i className="fa-solid fa-plus hover-red" onClick={() => { setOrderItem({ ...orderItem, quantity: orderItem.quantity + 1 }) }}></i>
                            </div> */}
                            {/* <div className='d-flex'>
                                <button className="btn btn-outline-dark flex-shrink-0" type="button" onClick={() => { }}>
                                    <i className="bi-order-fill me-1"></i>
                                    Add to Cart
                                </button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
            <section >
                <div className="container my-5 py-5">
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-12 col-lg-10">
                            <div className="card text-dark">
                                <div className="card-body p-4 pb-0">
                                    <h4 className="mb-0">Recent comments</h4>
                                    <p className="fw-light mb-4">Latest Comments section by users</p>
                                </div>
                                {listComments ? listComments.map(comment => comment && (
                                    <div key={comment.comment_id}>
                                        <div className="card-body p-4" >
                                            <div className="d-flex flex-start">
                                                <img className="rounded-circle shadow-1-strong me-3"
                                                    src={`/images/default.png`} alt="avatar" width="60"
                                                    height="60" />
                                                <div>
                                                    <h6 className="fw-bold mb-1" style={{ color: 'red' }}>{comment.user}</h6>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <p className="mb-0 text-muted">
                                                            {formatMongoDate(comment.timestamp)}
                                                        </p>
                                                        {isLoggedIn() && <div className="link-muted trash-can-icon" onClick={() => handleDeleteComment(comment.comment_id)}>
                                                            <i className="fa-solid fa-trash fa-sm order-quantity ms-2"></i>
                                                        </div>}
                                                    </div>
                                                    <Rating
                                                        className='mb-3'
                                                        initialRating={comment.rating}
                                                        emptySymbol={<FaStar className="star-empty" />}
                                                        fullSymbol={<FaStar className="star-full" />}
                                                        halfSymbol={<FaStarHalfAlt className="star-half" />}
                                                        readonly={true}
                                                    />
                                                    <p className="mb-0">
                                                        {comment.comment}
                                                    </p>
                                                </div>
                                            </div>
                                        </div >
                                        <hr className="my-0" />
                                    </div>
                                )) : <h5 className='p-4'>Be the first comment here.</h5>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div className="container my-5 py-5 text-dark">
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-12 col-lg-10">
                            <div className="card">
                                <div className="card-body p-4">
                                    <div className="d-flex flex-start w-100">
                                        <div className="w-100">
                                            {isLoggedIn() ? (<>
                                                <h5 className='mb-2'>Rating:</h5>
                                                <div className="align-items-center justify-content-center mb-3">
                                                    <Rating
                                                        initialRating={vote}
                                                        emptySymbol={<FaStar className="star-empty" />}
                                                        fullSymbol={<FaStar className="star-full" />}
                                                        halfSymbol={<FaStarHalfAlt className="star-half" />}
                                                        onChange={newVote => setVote(newVote)}
                                                    />
                                                    <button className='btn btn-primary btn-sm ms-2' onClick={handleVoting}>Vote</button>
                                                </div>
                                                <h5>You can post your comment:</h5>
                                                <div className="form-outline">
                                                    <label className="form-label mb-3" htmlFor="textAreaExample">What is your opinion?</label>
                                                    <textarea className="form-control" bookId="textAreaExample" rows="4" value={currentComment} onChange={e => setCurrentComment(e.target.value)}></textarea>
                                                </div>
                                                <div className="d-flex float-end mt-3">
                                                    <button type="button" className="btn btn-success" onClick={handlePostComment}>
                                                        Send <i className="fas fa-long-arrow-alt-right ms-1"></i>
                                                    </button>
                                                </div>
                                            </>) : (<div>
                                                <h5 className='text-muted' style={{ fontStyle: 'italic' }}>You can comment and vote after sign in</h5>
                                                <a href="/sign-in">Sign in here</a>
                                            </div>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default BookDetail;