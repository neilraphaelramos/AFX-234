import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './../css/style.css'

const MainHome = () => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate("/signin")
  }

  return (
    <div className="color-page d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1 className='font-color'>Welcome to Our 3D Model Web App</h1>
        <p className='font-color'>This is the introductory 3D Model Web App page. Click below to proceed to the login page.</p>
        <button className="btn btn-primary font-color" onClick={handleClick}>
          Go to Login
        </button>
      </div>
    </div>
  )
}

export default MainHome