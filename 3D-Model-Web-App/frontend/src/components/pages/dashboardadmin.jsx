import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
    const navigate = useNavigate();
    const [auth, setAuth] = useState(false);
    const [userAccounts, setUserAccounts] = useState([]);
    const [adminInfo, setAdminInfo] = useState(null);
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    axios.defaults.withCredentials = true;

    const handleLogout = () => {
        axios.post('http://localhost:8081/logout', {}, { withCredentials: true })
            .then(res => {
                console.log("Logout response:", res.data);
                setAuth(false);
                setAdminInfo([]);
                navigate("/signin");
            })
            .catch(err => {
                console.error("Logout error:", err);
            });
    };

    const admininfodata = () => {
        axios.get('http://localhost:8081/admin_info', { withCredentials: true })
            .then(res => {
                console.log("Admin Info Response:", res.data);
                setAdminInfo(res.data);
                setShowModal(true);
                setLoading(false);
                setAuth(true);
            })
            .catch(err => {
                console.error("Error fetching admin info:", err);
                setMessage("Failed to fetch admin information.");
                setAuth(false);
            });
    }

    const fetchAdminInfo = () => {
        admininfodata();
    };

    const userdata = () => {
        axios.get('http://localhost:8081/user_accounts', { withCredentials: true })
            .then(res => {
                console.log("User Accounts Response:", res.data);
                if (res.data.authenticated) {
                    setUserAccounts(res.data.accounts);
                    setLoading(false);
                } else {
                    navigate("/signin");
                }
            })
            .catch(err => {
                console.error("Error fetching user accounts:", err);
                setMessage("Failed to fetch user accounts.");
                navigate("/signin");
            });
    }

    useEffect(() => {
        userdata();
        const interval = setInterval(() => {
            userdata();;
        }, 5000); // 

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/admindashboard">Admin Dashboard</Link>
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
                                <Link className="nav-link active" aria-current="page" to="">Home</Link>
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
                                    <li>
                                        <Link className="dropdown-item" onClick={fetchAdminInfo}>Admin User</Link>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
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

            <div className={`modal ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Admin User Information</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            {adminInfo ? (
                                <div>
                                    <p><strong>Username:</strong> {adminInfo.user_name}</p>
                                    <p><strong>Email:</strong> {adminInfo.email}</p>
                                    <p><strong>Authentication Status:</strong> {auth ? 'Authenticated' : 'Not Auth'}</p>
                                </div>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && <div className="modal-backdrop fade show"></div>}
        </div>
    );
}

export default AdminDashboard;
