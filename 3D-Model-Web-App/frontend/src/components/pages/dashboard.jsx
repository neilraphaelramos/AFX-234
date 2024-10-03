import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserDashboard() {
    const navigate = useNavigate();
    const [auth, setAuth] = useState(false);
    const [userid, setUserid] = useState('');
    const [email, setEmail] = useState('');
    const [user_name, setUserName] = useState('');
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(true);
    axios.defaults.withCredentials = true;

    const handleLogout = () => {
        axios.post('http://localhost:8081/logout', {}, { withCredentials: true })
            .then(res => {
                console.log("Logout response:", res.data);
                setAuth(false); // Clear auth state
                setUserid(''); // Clear userid
                setEmail(''); // Clear email
                setUserName(''); // Clear user_name
                setUserInfo({}); // Clear userInfo
                navigate("/signin"); // Redirect to sign-in page
            })
            .catch(err => {
                console.error("Logout error:", err);
            });
    };

    const datafetch = () => {
        axios.get('http://localhost:8081/user_info', { withCredentials: true })
            .then(res => {
                console.log("User Info Response:", res.data);
                setLoading(false);

                if (res.data) {
                    const userInfo = res.data;
                    setAuth(true);
                    setUserid(userInfo.userid);
                    setEmail(userInfo.email);
                    setUserName(userInfo.user_name);
                    setUserInfo(userInfo);
                }
            })
            .catch(err => {
                setAuth(false);
                navigate("/signin");
            });
    }

    useEffect(() => {
        datafetch();
        const interval = setInterval(() => {
            datafetch();
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
                    <Link className="navbar-brand" to="/">Navbar</Link>
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
                                    Dropdown
                                </a>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" to="#">Action</Link></li>
                                    <li><Link className="dropdown-item" to="#">Another action</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" onClick={handleLogout}>Logout</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container mt-4">
                <h2>Welcome, {user_name || 'Guest'}!</h2> {/* Fix user_name */}
                <p>UserID: {userid || 'N/A'}</p>
                <p>Email: {email || 'Not logged in'}</p>
                <p>Auth: {auth ? 'Authenticated' : 'Not Auth'}</p>
                {/* Display additional user info here */}
                <p>First Name: {userInfo.first_name || 'N/A'}</p>
                <p>Last Name: {userInfo.last_name || 'N/A'}</p>
                <p>Gender: {userInfo.gender || 'N/A'}</p>
                <p>Birth Date: {userInfo.birth_date || 'N/A'}</p>
                <p>Bio: {userInfo.bio || 'N/A'}</p>
            </div>
        </div>
    );
}

export default UserDashboard;
