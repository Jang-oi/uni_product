import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const PublicRoute = ({ token }) => {
    return token ? <Navigate to='/' /> : <Outlet />;
};

export default PublicRoute;