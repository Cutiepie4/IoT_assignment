import React, { useEffect, useState } from 'react';
import { findOrdersByMemberId } from '../services/API';
import { Modal } from 'react-bootstrap';
import OrderDetail from './OrderDetail';

function UserOrders() {

    const [orders, setOrders] = useState([]);
    const [orderId, setOrderId] = useState('');
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        const asyncFunction = async () => {
            const ordersData = await findOrdersByMemberId();
            setOrders(ordersData);
            console.log(ordersData)
        }
        asyncFunction();

    }, [])

    const openDetailModal = (orderId) => {
        setShowDetailModal(true);
        setOrderId(orderId);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
    };

    return (
        <div className='container col-lg-8 py-3'>
            <div>
                <h3>Purchase History</h3>
                <hr />
            </div>

            <div>
                {orders && orders.length > 0 ? orders.map(order => (
                    <div className='row mb-3' key={'asdfa'} >
                        <div className='card d-flex position-relative mb-3' style={{ minHeight: '130px', backgroundColor: '#faf9ba' }}>
                            <div className='position-absolute start-0 top-0 m-3'>
                                <strong>Date: </strong> {order.timestamp}
                            </div>
                            <div className='position-absolute end-0 top-0 m-3' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                                <strong>Order id:</strong> {order._id}
                            </div>
                            <div className='position-absolute start-0 bottom-0 m-3'>
                                <strong>Cost:</strong> {(order.original_cost - order.discount_cost).toLocaleString()} vnđ
                            </div>
                            <div className='position-absolute end-0 bottom-0 m-3'>
                                <button className='btn btn-success' onClick={() => { openDetailModal(order._id) }}>
                                    Detail
                                </button>
                            </div>
                        </div>
                    </div>
                )) : <div><h5>You haven't purchased anything yet.</h5></div>}
            </div>
            <Modal show={showDetailModal} onHide={closeDetailModal} dialogClassName="modal-xl">
                <Modal.Header>
                    <h3>Order Detail</h3>
                </Modal.Header>
                <Modal.Body>
                    <OrderDetail orderId={orderId} />
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default UserOrders;