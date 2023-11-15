import React, { useEffect, useState } from 'react';
import { findOrderById, formatDate, formatMongoDate } from '../services/API';
import { useParams } from 'react-router-dom';

function OrderDetail(props) {
  const { orderId } = props;
  const [order, setOrder] = useState({});

  useEffect(() => {
    const asyncFunction = async () => {
      const orderData = await findOrderById(orderId);
      setOrder(orderData);
      console.log(orderData)
    };
    asyncFunction();
  }, [])

  return (
    <>
      <div className="container-fluid invoice-container">
        <header>
          <div className="row">
            <div className="col-sm-6">
              <strong>Customer: </strong> <span style={{ color: 'red', fontSize: '1.5rem', fontWeight: '500' }}>{order.user ? order.user.name : 'Guest'}</span>
            </div>
            <div className="col-sm-6 text-sm-end">
              <strong>Order No:</strong> {order._id}
            </div>
          </div>
          <hr />
        </header>

        <main>
          <div className="row">
            <div className="col-sm-6">
              <strong>Member ID:</strong> {order.user?.member_id ? order.user.member_id : 'Not a member'}
            </div>
            <div className="col-sm-6 text-sm-end">
              <strong>Date:</strong> {order.timestamp}
            </div>
          </div>
          <hr />

          <div className="card">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table mb-0">
                  <thead className="card-header">
                    <tr>
                      <td className="col-1">
                        <strong>#</strong>
                      </td>
                      <td className="col-1 text-center">
                        <strong></strong>
                      </td>
                      <td className="col-4">
                        <strong>Name</strong>
                      </td>
                      <td className="col-2 text-center">
                        <strong>Unit Price</strong>
                      </td>
                      <td className="col-1 text-center">
                        <strong>Quantity</strong>
                      </td>
                      {order.user && <td className="col-1 text-center">
                        <strong>Discount</strong>
                      </td>}
                      <td className="col-2 text-end">
                        <strong>Price</strong>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems && order.orderItems.map((item, index) => (
                      <tr>
                        <td>{index + 1}</td>
                        <td>
                          <img src={`./images/${item.book.imagePath}`} className="img-fluid"
                            style={{ maxWidth: '20px' }} alt="Book-cover" />
                        </td>
                        <td className="col-4" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                          {item.book.title}
                        </td>
                        <td className="col-1 text-center">{item.book.price.toLocaleString()} vnđ</td>
                        <td className="col-1 text-center">{item.copy_ids.length}</td>
                        {order.user && <td className="col-1 text-center">{item.book.discount}%</td>}
                        <td className="col-1 text-end">{(item.book.price * item.copy_ids.length).toLocaleString()} vnđ</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="card-footer">
                    <tr>
                      <td colspan={order.user ? '6' : '5'} className="text-end">
                        <strong>Original Cost: </strong>
                      </td>
                      <td className="text-end">{order.original_cost && order.original_cost.toLocaleString()} vnđ</td>
                    </tr>
                    <tr>
                      <td colspan={order.user ? '6' : '5'} className="text-end">
                        <strong>Discount Cost: </strong>
                      </td>
                      <td className="text-end">{order.discount_cost && order.discount_cost.toLocaleString()} vnđ</td>
                    </tr>
                    <tr>
                      <td colspan={order.user ? '6' : '5'} className="text-end border-bottom-0">
                        <h4>Total Cost: </h4>
                      </td>
                      <td className="text-end border-bottom-0"><h4 style={{ color: 'red' }}>{(order.original_cost - order.discount_cost).toLocaleString()} vnđ</h4></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default OrderDetail;
