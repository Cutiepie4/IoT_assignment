import React from 'react';

function Home() {
  return (
    <>
      <div className="container-fluid invoice-container">
        <header>
          <div className="row align-items-center">
            <div >
              <h4 className="text-7 mb-9">Chi tiết</h4>
            </div>
          </div>
          <hr />
        </header>

        <main>
          <div className="row">
            <div className="col-sm-6">
              <strong>Order No:</strong> abcxyzv
            </div>
            <div className="col-sm-6 text-sm-end">
              <strong>Date:</strong> 03/11/2023
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
                        <strong>STT</strong>
                      </td>
                      <td className="col-4">
                        <strong>Tên sản phẩm</strong>
                      </td>
                      <td className="col-2 text-center">
                        <strong>Đơn giá</strong>
                      </td>
                      <td className="col-1 text-center">
                        <strong>SL</strong>
                      </td>
                      <td className="col-2 text-end">
                        <strong>Thành tiền</strong>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="col-1">1</td>
                      <td className="col-4 text-1">Creating a website design</td>
                      <td className="col-2 text-center">$50.00</td>
                      <td className="col-1 text-center">10</td>
                      <td className="col-2 text-end">$500.00</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td className="text-1">Website Development</td>
                      <td className="text-center">$120.00</td>
                      <td className="text-center">10</td>
                      <td className="text-end">$1200.00</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td className="text-1">Optimize the site for search engines (SEO)</td>
                      <td className="text-center">$450.00</td>
                      <td className="text-center">1</td>
                      <td className="text-end">$450.00</td>
                    </tr>
                  </tbody>
                  <tfoot className="card-footer">
                    <tr>
                      <td colspan="4" className="text-end">
                        <strong>Tổng tiền:</strong>
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
                        <strong>Tổng:</strong>
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

export default Home;
