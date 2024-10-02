import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const { user } = useAuth(); // Get user info from context

    return (
        <Route
            {...rest}
            element={user ? <Component {...rest} /> : <Navigate to="/signin" />} // If user is authenticated, render component, otherwise redirect to signin
        />
    );
};

export default ProtectedRoute;
