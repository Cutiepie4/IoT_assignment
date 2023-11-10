import React, { useEffect, useState } from 'react';
import { deleteBook, disableRFIDContinuous, findAllBooks } from '../services/API';
import { Modal } from 'react-bootstrap';
import Book from './Book';
import Import from './Import';
import Copies from './Copies';

function Books() {
    const [listBooks, setListBooks] = useState([]);
    const [bookId, setBookId] = useState(0);
    const [showBookDetailModal, setShowBookDetailModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showCopiesModal, setShowCopiesModal] = useState(false);

    const openBookDetailModal = (bookId) => {
        setShowBookDetailModal(true);
        setBookId(bookId);
    };

    const closeBookDetailModal = () => {
        setShowBookDetailModal(false);
    };

    const openImportModal = (bookId) => {
        setBookId(bookId);
        setShowImportModal(true);
    }

    const closeImportModal = () => {
        disableRFIDContinuous();
        setShowImportModal(false);
    }

    const openCopiesModal = (bookId) => {
        setBookId(bookId);
        setShowCopiesModal(true);
    }

    const closeCopiesModal = () => {
        setShowCopiesModal(false);
    }

    useEffect(() => {
        const asyncFunction = async () => {
            const booksData = await findAllBooks();
            setListBooks(booksData);
        };
        asyncFunction();
    }, []);

    const handleDelete = (bookId) => {
        if (window.confirm('Are you sure to delete ?')) {
            deleteBook(bookId);
            setListBooks(listBooks.filter(itemFilter => itemFilter._id != bookId));
        }
    }

    return (
        <div className='px-5'>
            <h2>Book Storage</h2>
            <div className='pt-2'>
                <button className="btn btn-primary" style={{ marginRight: '5px' }} onClick={() => { openBookDetailModal('0') }}>Add New Book</button>
            </div>
            <br />
            <table className="table table-hover table-responsive table-striped">
                <thead className="table-primary">
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Description</th>
                        <th>Genre</th>
                        <th>Page</th>
                        <th>Price (vnd)</th>
                        <th>Discount (%)</th>
                        <th>In-Stock</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {listBooks.map((item, index) => (
                        <>
                            <tr key={item._id} className={item.in_stock == 0 ? 'row-hover found' : 'row-hover'} style={{ backgroundColor: '#ff0000' }}>
                                <td>{index + 1}</td>
                                <td>{item.title}</td>
                                <td>{item.author}</td>
                                <td style={{
                                    maxWidth: '300px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>{item.description}</td>
                                <td>{item.genre}</td>
                                <td>{item.page}</td>
                                <td>{item.price.toLocaleString()}</td>
                                <td>{item.discount}</td>
                                <td>{item.in_stock}</td>
                                <td>
                                    <button style={{ 'marginRight': '8px' }} className="btn btn-success" onClick={() => { openBookDetailModal(item._id); }}><i className="fa-solid fa-gear"></i></button>
                                    <button style={{ 'marginRight': '8px' }} className="btn btn-primary" onClick={() => { openImportModal(item._id); }}><i className="fa-solid fa-file-import"></i></button>
                                    <button style={{ 'marginRight': '8px' }} className="btn btn-secondary" onClick={() => { openCopiesModal(item._id); }}><i className="fa-solid fa-warehouse"></i></button>
                                    <button className="btn btn-danger" onClick={() => { handleDelete(item._id); }}><i className="fa-solid fa-trash-can"></i></button>
                                </td>
                            </tr>
                        </>
                    ))}
                </tbody>
            </table>
            <Modal show={showBookDetailModal} onHide={closeBookDetailModal} dialogClassName="modal-lg">
                <Modal.Header>
                    <h3>Book</h3>
                </Modal.Header>
                <Modal.Body>
                    <Book bookId={bookId} />
                </Modal.Body>
            </Modal>
            <Modal show={showImportModal} onHide={closeImportModal}>
                <Modal.Header>
                    <h3>Import</h3>
                </Modal.Header>
                <Modal.Body>
                    <Import bookId={bookId} />
                </Modal.Body>
            </Modal>
            <Modal show={showCopiesModal} onHide={closeCopiesModal}>
                <Modal.Header>
                    <h3>Copies Storage</h3>
                </Modal.Header>
                <Modal.Body>
                    <Copies bookId={bookId} />
                </Modal.Body>
            </Modal>
        </div >
    )
};

export default Books;