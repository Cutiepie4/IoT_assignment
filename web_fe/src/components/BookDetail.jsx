import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Rating from 'react-rating';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { find_book } from '../services/API';

function BookDetail() {
    const { id } = useParams();
    const [expanded, setExpanded] = useState(false);
    const [order, setOrder] = useState({ quantity: 1, book: {} });
    const [listComments, setListCommments] = useState([]);
    const [currentComment, setCurrentComment] = useState('');
    const [vote, setVote] = useState(0)

    const toggleExpanded = () => {
        setExpanded(!expanded);
    }

    const formatDate = (date) => {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString("en-US", {
            month: "long",
            day: "2-digit",
            year: "numeric"
        });
    }

    useEffect(() => {
        const asyncFunction = async () => {
            const bookData = await find_book(id);
            setOrder({ ...order, book: bookData });
        }
        asyncFunction();
    }, [id])

    const handlePostComment = async () => {
        if (vote === 0) {
            toast.info('You must rating before comment.');
            return;
        }
        // const newComment = await postComment({ username, bookId: order.book.id, comment: currentComment });
        // setListCommments([...listComments, newComment]);
        // setCurrentComment('');
    }

    const handleDeleteComment = (commentId) => {
        // deleteComment(commentId).then(res => setListCommments(listComments.filter(item => item.id !== commentId)));
    }

    const handleVoting = async () => {
        // await postRating({ username, bookId: order.book.id, vote });
    }

    return (
        <>
            <div className='container card col-md-12 col-lg-10' style={{ backgroundColor: '#faf9ba' }}>
                <div className="container px-4 px-lg-5 my-5 ">
                    <div className="row gx-4 gx-lg-5 align-items-center">
                        <div className="col-md-4 align-self-start" >
                            <img className="card-img-top mb-5 mb-md-0" src={order.book.imagePath && `/images/${order.book.imagePath}`} alt="book-cover" />
                        </div>
                        <div className="col-md-8">
                            <div className="display-6 mb-3 fw-bolder" style={{ margin: '0 0' }}>
                                {order.book.title}
                            </div>

                            <h3 className="fs-6 mb-3 fw-normal">by {order.book.author}</h3>
                            <Rating
                                className='mb-4'
                                initialRating={order.book.rating}
                                emptySymbol={<FaStar className="star-empty" />}
                                fullSymbol={<FaStar className="star-full" />}
                                halfSymbol={<FaStarHalfAlt className="star-half" />}
                                readonly={true}
                            />
                            <span className="book-voters card-vote">{order.book.voters} voters</span>
                            <p id='description' className={`lead fs-6 ${expanded ? 'expanded' : ''} mb-5`} onClick={toggleExpanded}>
                                {order.book.description}
                            </p>

                            <div className="fs-4 mb-2">
                                <span className={order.book.discount > 0 && `text-decoration-line-through text-muted`} style={{ color: 'red' }}>{order.book.price && order.book.price.toLocaleString() + ' vnđ'} </span>
                            </div>
                            <div className='d-flex'>
                                {order.book.discount > 0 && (<div className='fs-4 me-2' style={{ color: 'red' }}>
                                    {(Math.round(order.book.price * (100 - order.book.discount) / 100)).toLocaleString()} vnđ
                                </div>)}
                                <div className='d-flex align-items-center flickering-icon' style={{ color: 'red' }}>
                                    {order.book.discount > 0 && (
                                        <>
                                            {order.book.discount}%
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

                            <div className="d-flex align-items-center mb-3 mt-3">
                                <i className="fa-solid fa-minus me-2 order-quantity" onClick={() => { order.quantity > 1 && setOrder({ ...order, quantity: order.quantity - 1 }) }}></i>
                                <div className='btn btn-outline-dark me-2 flex-shrink-0' style={{ minWidth: '40px' }} >
                                    {order.quantity}
                                </div>
                                <i className="fa-solid fa-plus hover-red" onClick={() => { setOrder({ ...order, quantity: order.quantity + 1 }) }}></i>
                            </div>
                            <div className='d-flex'>
                                <button className="btn btn-outline-dark flex-shrink-0" type="button" >
                                    <i className="bi-order-fill me-1"></i>
                                    Add to Cart
                                </button>
                            </div>
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
                                {listComments.length > 0 ? listComments.map(comment => comment && (
                                    <div key={comment.id}>
                                        <div className="card-body p-4" >
                                            <div className="d-flex flex-start">
                                                <img className="rounded-circle shadow-1-strong me-3"
                                                    src={` /images/default.png`} alt="avatar" width="60"
                                                    height="60" />
                                                <div>
                                                    <h6 className="fw-bold mb-1" style={{ color: 'red' }}>{comment.user.username}</h6>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <p className="mb-0 text-muted">
                                                            {formatDate(comment.date)}
                                                        </p>
                                                        <div className="link-muted" onClick={() => handleDeleteComment(comment.id)}>
                                                            <i className="fa-solid fa-trash fa-sm order-quantity ms-2"></i>
                                                        </div>
                                                    </div>
                                                    <Rating
                                                        className='mb-3'
                                                        initialRating={comment.vote}
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
                                            {(<>
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
                                                    <textarea className="form-control" id="textAreaExample" rows="4" value={currentComment} onChange={e => setCurrentComment(e.target.value)}></textarea>
                                                </div>
                                                <div className="d-flex float-end mt-3">
                                                    <button type="button" className="btn btn-success" onClick={handlePostComment}>
                                                        Send <i className="fas fa-long-arrow-alt-right ms-1"></i>
                                                    </button>
                                                </div>
                                            </>)}
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