import React from 'react';
import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { identifyUser } from './services/API';

function UserRoute(props) {
    const { role } = props;

    useEffect(() => {

    }, []);

    if (role !== 'User') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;

}

export default UserRoute;