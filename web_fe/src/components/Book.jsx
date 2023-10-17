import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { add_book, find_book, update_book } from '../services/API';
import { toast } from 'react-toastify';

function Book(props) {

    const { bookId } = props;
    const [book, setBook] = useState({});
    const [image, setImage] = useState(null);
    const [imageExists, setImageExists] = useState(false);
    const [titleMessage, setTitleMessage] = useState('');
    const [authorMessage, setAuthorMessage] = useState('');
    const [dateMessage, setDateMessage] = useState('');
    const [pageMessage, setPageMessage] = useState('');
    const [soldMessage, setSoldMessage] = useState('');
    const [priceMessage, setPriceMessage] = useState('');

    useEffect(() => {
        const asyncFunction = async () => {
            const foundBook = await find_book(bookId);
            setBook(foundBook);
            const img = new Image();
            img.src = `/images/${foundBook.imagePath}`; // Đường dẫn đến hình ảnh
            img.onload = () => {
                setImageExists(true);
            };
        }
        if (bookId !== '0')
            asyncFunction();
    }, [bookId])

    const checkEmptyInput = (text) => {
        if (!text || text.trim().length === 0) {
            return false;
        }
        return true;
    }

    const checkNumber = (num) => {
        if (!num) return false;
        return num > 0;
    }

    const clearWarning = () => {
        setAuthorMessage('');
        setTitleMessage('');
        setDateMessage('');
        setPageMessage('');
        setSoldMessage('');
        setPriceMessage('');
    }

    const handleSubmit = () => {
        let ok = true;
        if (!checkEmptyInput(book.title)) {
            setTitleMessage('Required.');
            ok = false;
        }
        if (!checkEmptyInput(book.author)) {
            ok = false;
            setAuthorMessage('Required.');
        }
        if (!checkEmptyInput(book.date)) {
            ok = false;
            setDateMessage('Required.');
        }
        if (!checkNumber(book.page)) {
            ok = false;
            setPageMessage('Must be positive');
        }
        if (checkNumber(book.sold) < 0) {
            ok = false;
            setSoldMessage('Must be positive');
        }
        if (!checkNumber(book.price)) {
            ok = false;
            setPriceMessage('Must be positive');
        }

        if (!image && !imageExists) {
            ok = false;
            toast.info('Please choose a book cover.');
        }

        if (ok) {
            const formData = new FormData();
            if (image !== null) formData.append('image', image);
            formData.append('book', JSON.stringify(book));
            if (bookId == 0)
                add_book(formData);
            else update_book(formData);
            clearWarning();
        }
    }

    return (
        <div className="container form-control" >
            <h1>Book</h1>
            <div className="row">
                <div className="col-lg-6">
                    <div className="row">
                        <div className="col">
                            <label className="col-lg-10 form-label">
                                <span className='required'>Title</span>
                                <span style={{ color: 'red' }}>{titleMessage}</span>
                            </label>
                            <input type="text" className="col-lg-10  form-control" value={book.title}
                                onChange={(e) => { setBook({ ...book, title: e.target.value }) }} />
                        </div>
                        <div className="col">
                            <label className="col-lg-10 form-label">
                                <span className='required'>Author</span>
                                <span style={{ color: 'red' }}>{authorMessage}</span>
                            </label>
                            <input type="text" className="col-lg-10  form-control" value={book.author}
                                onChange={(e) => { setBook({ ...book, author: e.target.value }) }} />
                        </div>
                    </div>
                    <hr />
                    <div className="col">
                        <label className="col-lg-12 form-label">Description about the book</label>
                        <textarea className="col-lg-11  form-control" cols="30" value={book.description}
                            onChange={(e) => { setBook({ ...book, description: e.target.value }) }} />
                    </div>
                    <hr />

                    <div className="row">
                        <div className="col">
                            <label className="col-lg-10 form-label">
                                <span className='required'>Date Imported</span>
                                <span style={{ color: 'red' }}>{dateMessage}</span>
                            </label>
                            <input type="date" className="col-lg-10  form-control"
                                value={book.date} onChange={(e) => { setBook({ ...book, date: e.target.value }) }} />
                        </div>
                        <div className="col">
                            <label className="col-lg-10 form-label">
                                <span>Pages</span> <span style={{ color: 'red' }}>{pageMessage}</span>
                            </label>
                            <input min={1} type="number" className="col-lg-10  form-control"
                                value={book.page} onChange={(e) => { setBook({ ...book, page: e.target.value }) }} />
                        </div>
                    </div>
                    <hr />
                    <div className='row'>
                        <div className="col-4">
                            <label className="form-label">Genre</label>
                            <select
                                className="border-1 form-select"
                                onChange={(e) => { setBook({ ...book, genre: e.target.value }) }}
                                defaultValue={book.genre ? book.genre : "default"}
                            >
                                <option disabled value="default">Select a genre</option>
                                <option value="Action" selected={book.genre === "Action"}>Action</option>
                                <option value="Comedy" selected={book.genre === "Comedy"}>Comedy</option>
                                <option value="Fantasy" selected={book.genre === "Fantasy"}>Fantasy</option>
                                <option value="Historical" selected={book.genre === "Historical"}>Historical</option>
                                <option value="Horror" selected={book.genre === "Horror"}>Horror</option>
                                <option value="Romance" selected={book.genre === "Romance"}>Romance</option>
                                <option value="Thriller" selected={book.genre === "Thriller"}>Thriller</option>
                            </select>
                        </div>
                        <div className="col-4">
                            <label className="col-lg-10 form-label">
                                <span>Sold Copies</span>
                                <span style={{ color: 'red' }}>{soldMessage}</span>
                            </label>
                            <input min={0} type="number" className="col-lg-10  form-control"
                                value={book.sold} onChange={(e) => { setBook({ ...book, sold: e.target.value }) }}
                                disabled />
                        </div>
                        <div className="col-4">
                            <label className="col-lg-10 form-label">
                                <span>Price (vnđ)</span>
                                <span style={{ color: 'red' }}>{priceMessage}</span>
                            </label>
                            <input min={1} type="number" className="col-lg-10  form-control" value={book.price} onChange={(e) => { setBook({ ...book, price: e.target.value }) }} />
                        </div>
                    </div>

                    <hr />
                    <div className="col-12">
                        <button className="btn btn-success" onClick={handleSubmit}>
                            {bookId === 0 ? 'Add' : 'Save'}
                        </button>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div>
                        <input type="file" accept="image/*"
                            onChange={(e) => { setImage(e.target.files[0]) }} />
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <div className="upload-preview">
                                {image ?
                                    (<img style={{ maxHeight: '480px', width: 'auto' }}
                                        className="card-img-top"
                                        src={URL.createObjectURL(image)}
                                        alt='book-cover'
                                    />)
                                    : imageExists && book.imagePath && (
                                        <img style={{ maxHeight: '480px', width: 'auto' }}
                                            className="card-img-top"
                                            src={`/images/${book.imagePath}`}
                                            alt='book-cover'
                                        />
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Book;