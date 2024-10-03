import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import validationsignin from '../utilities/signin/signin-validation';
import axios from 'axios';
import './../css/style.css'

const SignInForm = () => {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    const handleInput = (event) => {
        const { name, value } = event.target;
        setValues(prev => ({ ...prev, [name]: value }));
        setServerError('');
    };

    axios.defaults.withCredentials = true;
    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validationsignin(values);
        setErrors(validationErrors);

        if (!validationErrors.email && !validationErrors.password) {
            try {
                const res = await axios.post('http://localhost:8081/login', values);
                console.log('Login Response:', res.data); // Log the full response

                if (res.data.message === "Login successful") {
                    console.log(res.data);
                    const role = res.data.role;
                    if (role === 'user') {
                        navigate('/dashboard');
                    } else {
                        navigate('/admindashboard');
                    }
                } else {
                    setServerError(res.data.message || "Invalid email or password");
                    console.log(res.data.message); // Log for debugging
                }
            } catch (err) {
                // Handle the case where the server returns an error
                if (err.response) {
                    setServerError(err.response.data.message || "An error occurred. Please try again.");
                    console.log("Error Response:", err.response.data);
                } else {
                    console.error("Login error:", err);
                    setServerError("An error occurred during login.");
                }
            }
        } else {
            console.log("Validation Errors:", validationErrors);
        }
    };

    return (
        <div className='d-flex justify-content-center align-items-center color-page' style={{ height: '100vh' }}>
            <div className='p-4 bg-white w-25 rounded shadow'>
                <h3 className="text-center mb-3">Sign In</h3>
                <form autoComplete='off' onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='email' className='form-label'>Email</label>
                        <input
                            type='email'
                            id='email'
                            placeholder='Enter Email'
                            name='email'
                            onChange={handleInput}
                            className='form-control round-0'
                        />
                        {errors.email && <span className='text-danger'> {errors.email} </span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password' className='form-label'>Password</label>
                        <input
                            type='password'
                            id='password'
                            placeholder='Enter Password'
                            name='password'
                            onChange={handleInput}
                            className='form-control round-0'
                        />
                        {errors.password && <span className='text-danger'> {errors.password} </span>}
                    </div>
                    {serverError && <div className='mb-3'>
                        <span className='text-danger'>{serverError}</span>
                    </div>}
                    <button type='submit' className='btn btn-success w-100'>Login</button>
                </form>
                <p className="text-center mt-3">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default SignInForm;
