import React, { createContext, useContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode'; // Install this package using `npm install jwt-decode`

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        if (token) {
            const decodedUser = jwt_decode(token); // Decode the token to get user data
            setUser(decodedUser); // Set user data
        }
    }, []);

    const login = (userData) => {
        setUser(userData); // Update user state
        localStorage.setItem('token', userData.token); // Store token in local storage
    };

    const logout = () => {
        setUser(null); // Clear user data
        localStorage.removeItem('token'); // Remove token from local storage
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
