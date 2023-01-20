import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute = ({token}) => {
    return token ? <Outlet /> : <Navigate to='/sign-in' />;
};

export default PrivateRoute;