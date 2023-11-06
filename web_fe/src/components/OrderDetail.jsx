import React, { useEffect, useState } from 'react';
import { findOrderById, formatDate, formatMongoDate } from '../services/API';
import { useParams } from 'react-router-dom';

function OrderDetail() {
  const orderId = useParams();
  const [order, setOrder] = useState({});

  useEffect(() => {
    const asyncFunction = async () => {
      const orderData = findOrderById(orderId);
      setOrder(orderData);
    };
    asyncFunction();
  }, [])

  return (
    <>
      <div className="container-fluid invoice-container">
        <header>
          <div className="row align-items-center">
            <div >
              <h4 className="text-7 mb-9">Detail</h4>
            </div>
          </div>
          <hr />
        </header>

        <main>
          <div className="row">
            <div className="col-sm-6">
              <strong>Order No:</strong> {order._id}
            </div>
            <div className="col-sm-6 text-sm-end">
              <strong>Date:</strong> {formatDate(order.timestamp)}
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
                      <td className="col-4">
                        <strong>Name</strong>
                      </td>
                      <td className="col-2 text-center">
                        <strong>Unit Price</strong>
                      </td>
                      <td className="col-1 text-center">
                        <strong>Quantity</strong>
                      </td>
                      <td className="col-2 text-end">
                        <strong>Price</strong>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items && order.items.map(item => (
                      <tr>
                        <td className="col-1">1</td>
                        <td className="col-4 text-1">{item.title}</td>
                        <td className="col-2 text-center">{item.price}</td>
                        <td className="col-1 text-center">{item.quantity}</td>
                        <td className="col-2 text-end">$500.00</td>
                      </tr>
                    ))}
                    {/* <tr>
                      <td className="col-1">1</td>
                      <td className="col-4 text-1">Creating a website design</td>
                      <td className="col-2 text-center">$50.00</td>
                      <td className="col-1 text-center">10</td>
                      <td className="col-2 text-end">$500.00</td>
                    </tr> */}

                  </tbody>
                  <tfoot className="card-footer">
                    <tr>
                      <td colspan="4" className="text-end">
                        <strong>Checkout:</strong>
                      </td>
                      <td className="text-end">$2150.00</td>
                    </tr>
                    <tr>
                      <td colspan="4" className="text-end">
                        <strong>Thuế GTGT:</strong>
                      </td>
                      <td className="text-end">$215.00</td>
                    </tr>
                    <tr>
                      <td colspan="4" className="text-end border-bottom-0">
                        <strong>Total Price</strong>
                      </td>
                      <td className="text-end border-bottom-0">$2365.00</td>
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
