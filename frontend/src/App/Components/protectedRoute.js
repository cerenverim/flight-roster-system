// ProtectedRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = useSelector(state => state.user.token) || localStorage.getItem('token');
    return token ? <Outlet /> : <Navigate to="/signIn" replace />;
};

export default ProtectedRoute;
