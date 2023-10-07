import React, { useState } from 'react';
import { MDBInput } from 'mdb-react-ui-kit';

function LoginRegistration() {
    const [page, setPage] = useState('Login');

    return (
        <div style={{ maxWidth: '500px' }} className='container card mt-5'>
            <ul className="nav nav-pills nav-justified mb-2" id="ex1" role="tablist">
                <li className="nav-item" role="presentation">
                    <a className={`nav-link ${page == 'Login' ? 'active' : ''}`} data-mdb-toggle="pill" href="#pills-login" role="tab"
                        aria-controls="pills-login" aria-selected="true" onClick={() => setPage('Login')}>Login</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a className={`nav-link ${page == 'Register' ? 'active' : ''}`} data-mdb-toggle="pill" href="#pills-register" role="tab"
                        aria-controls="pills-register" aria-selected="false" onClick={() => setPage('Register')}>Register</a>
                </li>
            </ul>

            <div className="tab-content">
                <div className={`tab-pane fade ${page == 'Login' ? 'show active' : ''}`} id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                    <form>
                        <div className="form-outline mb-2">
                            <MDBInput type="email" className="form-control" />
                            <label className="form-label" >Email or username</label>
                        </div>

                        <div className="form-outline mb-2">
                            <MDBInput type="password" className="form-control" />
                            <label className="form-label" >Password</label>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6 d-flex justify-content-center">
                                <div className="form-check mb-2 mb-md-0">
                                    <input className="form-check-input" type="checkbox" checked />
                                    <label className="form-check-label" > Remember me </label>
                                </div>
                            </div>

                            <div className="col-md-6 d-flex justify-content-center">
                                <a href="#!">Forgot password?</a>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block mb-2">Sign in</button>

                    </form>
                </div>
                <div className={`tab-pane fade ${page == 'Register' ? 'show active' : ''}`} id="pills-register" role="tabpanel" aria-labelledby="tab-register">
                    <form>

                        <div className="form-outline mb-2">
                            <MDBInput type="text" id="registerName" className="form-control" />
                            <label className="form-label" >Name</label>
                        </div>

                        <div className="form-outline mb-2">
                            <MDBInput type="text" id="registerUsername" className="form-control" />
                            <label className="form-label" >Username</label>
                        </div>

                        <div className="form-outline mb-2">
                            <MDBInput type="email" id="registerEmail" className="form-control" />
                            <label className="form-label" >Email</label>
                        </div>

                        <div className="form-outline mb-2">
                            <MDBInput type="password" id="registerPassword" className="form-control" />
                            <label className="form-label" >Password</label>
                        </div>

                        <div className="form-outline mb-2">
                            <MDBInput type="password" id="registerRepeatPassword" className="form-control" />
                            <label className="form-label" >Repeat password</label>
                        </div>

                        <div className="form-check d-flex justify-content-center mb-3">
                            <input className="form-check-input me-2" type="checkbox" value="" id="registerCheck" checked
                                aria-describedby="registerCheckHelpText" />
                            <label className="form-check-label" >
                                I have read and agree to the terms
                            </label>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block mb-2">Sign up</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginRegistration;