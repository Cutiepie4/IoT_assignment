import React, { useEffect, useState } from 'react';
import { deleteCopy, findCopies } from '../services/API';

function Copies(props) {

    const { bookId } = props;

    const [listCopies, setListCopies] = useState([]);

    const handleDelete = (copyId) => {
        deleteCopy(copyId);
    }

    useEffect(() => {
        const asyncFunction = async () => {
            const data = await findCopies(bookId);
            setListCopies(data);
        }
        asyncFunction();
    }, [bookId])

    return (
        <div className='container form-control mt-3' style={{ maxWidth: '500px' }}>
            <h5>Book: <span style={{ color: 'red' }}>{bookId}</span></h5>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Copy ID</th>
                        <th>Date Imported</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {listCopies.length === 0 ? (
                        <tr>
                            <h5>No copies found.</h5>
                        </tr>
                    ) : listCopies.map((item, index) => (
                        <tr>
                            <td>{index + 1}</td>
                            <td>{item.copy_id}</td>
                            <td>{item.date_imported}</td>
                            <td><i className="fa-regular fa-trash-can fa-md trash-can-icon"
                                onClick={() => {
                                    if (window.confirm(`Are you sure to remove this ${item.copy_id} book copy ?`)) {
                                        setListCopies(listCopies.filter(itemFilter => itemFilter !== item));
                                        handleDelete(item.copy_id);
                                    }
                                }} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table >

        </div >
    );
}

export default Copies;