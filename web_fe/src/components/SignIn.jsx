import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'
import { signIn } from '../services/API';

function SignIn() {

    const navigate = useNavigate();
    const [account, setAccount] = useState({});
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = () => {
        const asyncFunction = async () => {
            const flag = await signIn(account);
            if (flag)
                navigate('/');
        }
        asyncFunction();
    }

    useEffect(() => {

    }, []);

    return (
        <section className="vh-100" style={{ backgroundColor: "#eee" }}>
            <div className="container h-100">
                <div className="row d-flex py-5 h-100">
                    <div className="col-lg-12 col-xl-11">
                        <div className="card text-black" style={{ borderRadius: '25px' }}>
                            <div className="card-body p-md-5">
                                <div className="row justify-content-center">
                                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                                        <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign In</p>
                                        <form className="mx-1 mx-md-4">
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input type="text" className="form-control" placeholder='Username' value={account.username} onChange={e => setAccount({ ...account, username: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input type="password" className="form-control" placeholder='Password' value={account.password} onChange={e => setAccount({ ...account, password: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between mb-5 align-items-center">
                                                <div className='d-flex justify-content-between form-check'>
                                                    <input className="form-check-input mx-2" type="checkbox" value="" id="form2Example3c" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                                                    <label className="form-check-label" htmlFor="form2Example3c">
                                                        Remember me
                                                    </label>
                                                </div>

                                            </div>
                                            <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                                <button type="button" className="btn btn-primary" onClick={handleLogin}>Sign In</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SignIn;