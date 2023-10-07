import React from 'react';
import { ToastContainer } from 'react-toastify';
import { Route, Routes } from 'react-router-dom';
import Book from './components/Book';
import Books from './components/Books';
import Import from './components/Import';
import Copies from './components/Copies';
import Checkout from './components/Checkout';
import Nav from './components/Nav';
import Home from './components/Home';
import BookDetail from './components/BookDetail';
import UserList from './components/UserList';
import LoginRegistration from './components/LoginRegistration';

function App(props) {
  return (
    <>
      <Routes>
        <Route element={<Nav />} path='/'>
          <Route index element={<Home />} />
          <Route element={<BookDetail />} path={"/book-detail/:id"} />
          <Route element={<Books />} path={"/books"} />
          <Route element={<Import />} path={"/import/:bookId"} />
          <Route element={<Copies />} path={"/copies/:bookId"} />
          <Route element={<Checkout />} path={"/checkout"} />
          <Route element={<UserList />} path={"/users"} />
        </Route>
        <Route element={<LoginRegistration />} path={"/login"} />
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