import React, { useState, useContext } from 'react'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthProvider';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' })
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { IsLoggedIn, setIsLoggedIn } = useContext(AuthContext);

    const handlechange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handelsubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("Form Submitted:", formData);

        try {
            const response = await axios.post('http://localhost:8000/api/v1/token/', formData);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('username', formData.username);
            console.log("Login successful!");
            setIsLoggedIn(true);
            navigate('/')

        } catch (error) {
            setErrors(error.response.data);
            console.log("Invaild Credentials");
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 bg-light-dark p-5 rounded">
                        <h3 className='text-light text-center'>Login Account</h3>
                        <form onSubmit={handelsubmit}>
                            <div className="mb-3">
                                <input type="text" className='form-control mb-1' value={formData.username} onChange={handlechange} name='username' placeholder='Enter Username' />
                                <small>{errors.username && <div className="text-danger">{errors.username}</div>}</small>
                            </div>
                            <div className="mb-3">
                                <input type="password" className='form-control mb-1' value={formData.password} onChange={handlechange} name="password" placeholder='Enter Password' />
                                <small>{errors.password && <div className="text-danger">{errors.password}</div>}</small>
                            </div>
                            {loading ?
                                (<button type='submit' className='btn btn-info d-block mx-auto' disabled><FontAwesomeIcon icon={faSpinner} spin className='me-2' />Logging in...</button>) :
                                (<button type='submit' className='btn btn-info d-block mx-auto'>Login</button>)}
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
