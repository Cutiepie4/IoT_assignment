import React from 'react';
import ColorPicking from './components/ColorPicking';
import Cards from './components/Cards';
import { ToastContainer } from 'react-toastify';
function App(props) {

  return (
    <>
      <div>
        {/* <ColorPicking /> */}
        <Cards />
      </div>
      <ToastContainer
        position="top-center"
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