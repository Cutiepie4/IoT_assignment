import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteCopy, find_copies } from '../services/API';

function Copies(props) {

    const { bookId } = useParams();

    const [listCopies, setListCopies] = useState([]);

    const navigate = useNavigate();

    const handleDelete = (copyId) => {
        if (window.confirm(`Are you sure to remove this ${copyId} book copy ?`)) {
            deleteCopy(copyId);
        }
    }

    useEffect(() => {
        const asyncFunction = async () => {
            const data = await find_copies(bookId);
            setListCopies(data);
        }
        asyncFunction();
    }, [])

    return (
        <div className='container form-control mt-3' style={{ maxWidth: '400px' }}>
            <h5>List copies of <span style={{ color: 'red' }}>{bookId}</span></h5>
            <ul className="list-group mb-3">
                {listCopies.length == 0 ?
                    (<div>
                        <h3>No copies found.</h3>
                        <button className='btn btn-success' onClick={() => { navigate(`/import/${bookId}`) }}>Import now</button>
                    </div>)
                    : listCopies.map((item) => (
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            {item}
                            <i className="fa-regular fa-trash-can fa-md trash-can-icon" onClick={() => { setListCopies(listCopies.filter(itemFilter => itemFilter != item)); handleDelete(item); }}></i>
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export default Copies;