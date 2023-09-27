import React, { useEffect, useState } from 'react';
import { delete_book, find_all_books } from '../services/API';
import { useNavigate } from 'react-router-dom';

function Books() {
    const [listBooks, setListBooks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const asyncFunction = async () => {
            const booksData = await find_all_books();
            setListBooks(booksData);
        };
        asyncFunction();
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure to delete ?')) {
            delete_book(id);
        }
    }

    return (
        <div className='px-5'>
            <h2>Book Storage</h2>
            <div className='pt-2'>
                <button className="btn btn-primary" style={{ marginRight: '5px' }} onClick={() => { navigate('/book/0') }}>Add New Book</button>
            </div>

            <br />
            <div>
                <table className="table table-bordered table-hover" >
                    <thead className="table-primary">
                        <tr>
                            <th>Id</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Description</th>
                            <th>Genre</th>
                            <th>Page</th>
                            <th>Price (vnd)</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {listBooks.map((item) => (
                            <tr key={item._id} className='row-hover'>
                                <td>{item._id}</td>
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
                                <td>{item.price}</td>
                                <td>
                                    <button style={{ 'marginRight': '8px' }} className="btn btn-success" onClick={() => { navigate(`/book/${item._id}`) }}><i className="fa-solid fa-gear"></i></button>
                                    <button style={{ 'marginRight': '8px' }} className="btn btn-primary" onClick={() => { navigate(`/import/${item._id}`) }}><i className="fa-solid fa-file-import"></i></button>
                                    <button style={{ 'marginRight': '8px' }} className="btn btn-secondary" onClick={() => { navigate(`/copies/${item._id}`) }}><i className="fa-solid fa-warehouse"></i></button>
                                    <button className="btn btn-danger" onClick={() => { handleDelete(item._id); setListBooks(listBooks.filter(itemFilter => itemFilter._id != item._id)) }}><i className="fa-solid fa-trash-can"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    )
};

export default Books;