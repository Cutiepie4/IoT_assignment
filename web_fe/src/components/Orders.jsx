import React, { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal } from 'react-bootstrap';
import OrderDetail from './OrderDetail';
import { findAllOrders, formatDate } from '../services/API';

function Orders() {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [orders, setOrders] = useState([]);
    const [filterOrders, setFilterOrders] = useState([]);

    const openDetailModal = (orderId) => {
        setShowDetailModal(true);
        setOrderId(orderId);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
    };

    useEffect(() => {
        const asyncFunction = async () => {
            const ordersData = await findAllOrders();
            setOrders(ordersData);
        }
        asyncFunction();
    }, []);

    const parseDate = (date) => {
        const newDate = new Date(date.$gte);
        return new Date(
            newDate.getFullYear(),
            newDate.getMonth(),
            newDate.getDate()
        );
    }

    const filterOrdersByDate = () => {
        const groupedOrders = {};

        orders.forEach((order) => {
            const orderDateOnly = parseDate(order.timestamp);

            const startDateOnly = new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate()
            );
            const endDateOnly = new Date(
                endDate.getFullYear(),
                endDate.getMonth(),
                endDate.getDate()
            );

            if (
                orderDateOnly >= startDateOnly &&
                orderDateOnly <= endDateOnly
            ) {
                const dateKey = formatDate(orderDateOnly);
                if (!groupedOrders[dateKey]) {
                    groupedOrders[dateKey] = [];
                }
                groupedOrders[dateKey].push(order);
            }
        });

        const formattedOrders = Object.keys(groupedOrders).map((dateKey) => ({
            date: dateKey,
            ordersInDate: groupedOrders[dateKey],
        }));

        return formattedOrders;
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        setFilterOrders(filterOrdersByDate());
    }, [orders, startDate, endDate])

    return (
        <>
            <div className='container'>
                <div className='row'>
                    <div className='col col-lg-4 fw-bold'>
                        Start Date:
                        <DatePicker className='ms-2 form-control' maxDate={endDate} selected={startDate} onChange={(date) => setStartDate(date)} />
                    </div>
                    <div className='col col-lg-4 fw-bold'>
                        End Date:
                        <DatePicker className='ms-2 form-control' minDate={startDate} selected={endDate} onChange={(date) => setEndDate(date)} />
                    </div>
                </div>
                <hr />

                {filterOrders && filterOrders.map(order => (
                    <div className='row mb-3' key={order._id}>
                        <div className='col col-lg-2 me-3 text-center' style={{ borderRight: '3px solid gray' }}>
                            {order.date}
                        </div>
                        <div className='col col-lg-9'>
                            <div className='row'>
                                {order.ordersInDate.map((orderInDate) => (
                                    <div className='col-lg-6' key={orderInDate._id}>
                                        <div className='card d-flex position-relative mb-3' style={{ minHeight: '120px' }}>
                                            <div className='position-absolute start-0 top-0 m-2'>
                                                <strong>Customer: </strong> {orderInDate.user ? orderInDate.user.name : 'Guest'}
                                            </div>
                                            <div className='position-absolute end-0 top-0 m-2' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                                                <strong>Order id:</strong> {orderInDate._id}
                                            </div>
                                            <div className='position-absolute start-0 bottom-0 m-2'>
                                                <strong>Value:</strong> {(orderInDate.original_cost - orderInDate.discount_cost).toLocaleString()} vnđ
                                            </div>
                                            <div className='position-absolute end-0 bottom-0 m-2'>
                                                <button className='btn btn-success' onClick={() => { openDetailModal(orderInDate._id); }}>
                                                    Detail
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                ))}
                <hr />
            </div >
            <Modal show={showDetailModal} onHide={closeDetailModal} dialogClassName="modal-xl">
                <Modal.Header>
                    <h3>Order Detail</h3>
                </Modal.Header>
                <Modal.Body>
                    <OrderDetail orderId={orderId} />
                </Modal.Body>
            </Modal>
        </>
    );
}


export default Orders;