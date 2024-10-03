import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import validationsignup from '../utilities/signup/signup-validation';
import axios from 'axios';
import './../css/style.css'

const SignUpForm = () => {
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const handleInput = (event) => {
        const { name, value } = event.target;
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const validationErrors = validationsignup(values);
        setErrors(validationErrors);

        // Log validation errors
        console.log("Validation Errors:", validationErrors);

        if (!validationErrors.username && !validationErrors.email && !validationErrors.password) {
            try {
                console.log("Submitting values:", values);
                const res = await axios.post('http://localhost:8081/register', values);
                console.log("Data account created", res.data);
                navigate('/signin');
            } catch {
                console.error("Error during signup:", err);
            }
        }
    };

    return (
        <div className='d-flex justify-content-center align-items-center color-page' style={{ height: '100vh' }}>
            <div className='p-4 bg-white w-25 rounded shadow'>
                <h3 className="text-center mb-3">Sign Up</h3>
                <form autoComplete='off' onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='username' className='form-label'><strong>Username</strong></label>
                        <input type='text' id='username' placeholder='Enter Username'
                            name='username'
                            onChange={handleInput}
                            className='form-control round-0' />
                        {errors.username && <span className='text-danger'> {errors.username} </span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='email' className='form-label'>Email</label>
                        <input type='email' id='email' placeholder='Enter Email'
                            name='email'
                            onChange={handleInput}
                            className='form-control round-0' />
                        {errors.email && <span className='text-danger'> {errors.email} </span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password' className='form-label'>Password</label>
                        <input type='password' id='password' placeholder='Enter Password'
                            name='password'
                            onChange={handleInput}
                            className='form-control round-0' />
                        {errors.password && <span className='text-danger'> {errors.password} </span>}
                    </div>
                    <button type='submit' className='btn btn-success w-100'>Sign Up</button>
                </form>
                <p className="text-center mt-3">
                    Already have an account? <Link to="/signin">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpForm;
