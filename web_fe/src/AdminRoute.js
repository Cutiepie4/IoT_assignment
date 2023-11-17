import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

function AdminRoute(props) {

    const { role } = props;

    useEffect(() => {

    }, []);

    if (role !== 'Admin') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default AdminRoute;