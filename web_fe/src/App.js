import React, { useEffect, useState } from 'react';
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
import ReactLoading from 'react-loading';

import '@fortawesome/fontawesome-free/css/all.css';
import './styles/customStyle.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/userList.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminRoute from './AdminRoute';
import UserRoute from './UserRoute';
import { identifyUser } from './services/API';
import UserDetail from './components/UserDetail';

function App() {

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('Guest');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await identifyUser();
        setRole(userData.role);
        setUsername(userData.username);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [])

  if (loading) {
    return <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <ReactLoading type={'spin'} color={'green'} />;
    </div>
  }

  return (
    <>
      <Routes key={role}>
        <Route element={<Nav role={role} username={username} />} path='/'>
          <Route index element={<Home />} />
          <Route element={<BookDetail />} path={"/book-detail/:bookId"} />
          <Route element={<AdminRoute role={role} />} >
            <Route element={<Checkout />} path={"/checkout"} />
            <Route element={<Copies />} path={"/copies/:bookId"} />
            <Route element={<Import />} path={"/import/:bookId"} />
            <Route element={<Books />} path={"/books"} />
            <Route element={<Orders />} path={"/orders/"} />
            <Route element={<OrderDetail />} path={"/order-detail"} />
            <Route element={<UserList />} path={"/users"} />
            <Route element={<UserDetail />} path={"/user-detail"} />
          </Route>

          <Route element={<UserRoute role={role} />} >

          </Route>
        </Route>

        <Route element={<SignUp role={role} />} path={"/sign-up"} />
        <Route element={<SignIn />} path={"/sign-in"} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={1500}
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