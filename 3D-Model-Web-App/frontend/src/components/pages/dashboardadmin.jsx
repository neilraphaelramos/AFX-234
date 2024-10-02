import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
    const navigate = useNavigate();
    const [auth, setAuth] = useState(false);
    const [role, setRole] = useState('');
    const [userAccounts, setUserAccounts] = useState([]);
    const [message, setMessage] = useState('');

    axios.defaults.withCredentials = true;

    const handleLogout = () => {
        axios.post('http://localhost:8081/logout', {}, { withCredentials: true })
            .then(res => {
                console.log("Logout response:", res.data);
                setAuth(false);
                setUserAccounts([]);
                navigate("/signin");
            })
            .catch(err => {
                console.error("Logout error:", err);
            });
    };

    useEffect(() => {
        // Fetch user accounts
        axios.get('http://localhost:8081/user_accounts', { withCredentials: true })
            .then(res => {
                console.log("User Accounts Response:", res.data);
                if (res.data.authenticated) {
                    setAuth(true);
                    setRole(res.data.role);
                    setUserAccounts(res.data.accounts);
                } else {
                    navigate("/signin");
                }
            })
            .catch(err => {
                console.error("Error fetching user accounts:", err);
                setMessage("Failed to fetch user accounts.");
                navigate("/signin");
            });
    }, []);

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Admin Dashboard</Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/dashboard">Home</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Options
                                </a>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" onClick={handleLogout}>Logout</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container mt-4">
                <h2>Admin Dashboard</h2>
                {message && <div className="alert alert-danger">{message}</div>}
                <table className="table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userAccounts.length > 0 ? (
                            userAccounts.map(account => (
                                <tr key={account.userid}>
                                    <td>{account.userid}</td>
                                    <td>{account.user_name}</td>
                                    <td>{account.email}</td>
                                    <td>{account.role}</td>
                                    <td>{new Date(account.created_at).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No user accounts found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;
