import React from 'react';
import { ToastContainer } from 'react-toastify';
import { Route, Routes } from 'react-router-dom';
import Books from './components/Books';
import Import from './components/Import';
import Copies from './components/Copies';
import Checkout from './components/Checkout';
import Nav from './components/Nav';
import Home from './components/Home';
import BookDetail from './components/BookDetail';
import UserList from './components/UserList';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Orders from './components/Orders';
import OrderDetail from './components/OrderDetail';

import '@fortawesome/fontawesome-free/css/all.css';
import './styles/customStyle.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/userList.css';

import './styles/listorder.css';
import './styles/bill.css'
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <>
      <Routes>
        <Route element={<Nav />} path='/'>
          <Route index element={<Home />} />
          <Route element={<BookDetail />} path={"/book-detail/:bookId"} />
          <Route element={<Orders />} path={"/orders/"} />
          <Route element={<OrderDetail />} path={"/order-detail"} />
          <Route element={<Books />} path={"/books"} />
          <Route element={<Import />} path={"/import/:bookId"} />
          <Route element={<Copies />} path={"/copies/:bookId"} />
          <Route element={<Checkout />} path={"/checkout"} />
          <Route element={<UserList />} path={"/users"} />
        </Route>
        <Route element={<SignIn />} path={"/sign-in"} />
        <Route element={<SignUp />} path={"/sign-up"} />
        <Route element={<Checkout />} path={"/checkout"} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        draggable
        theme="light"
      />
    </>
  );
}

export default App;