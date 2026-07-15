import { useState, useContext } from 'react';
import axiosInstance from '../axiosinstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthProvider';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { setIsLoggedIn } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            const response = await axiosInstance.post('token/', formData);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('username', formData.username);
            setIsLoggedIn(true);
            navigate('/dashboard');
        } catch (error) {
            setErrors(
                error.response?.data || { non_field_errors: 'Server is unreachable. Please try again.' }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 bg-light-dark p-5 rounded">
                        <h3 className='text-light text-center'>Login Account</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <input type="text" className='form-control mb-1' value={formData.username} onChange={handleChange} name='username' placeholder='Enter Username' />
                                <small>{errors.username && <div className="text-danger">{errors.username}</div>}</small>
                            </div>
                            <div className="mb-3">
                                <input type="password" className='form-control mb-1' value={formData.password} onChange={handleChange} name="password" placeholder='Enter Password' />
                                <small>{errors.password && <div className="text-danger">{errors.password}</div>}</small>
                            </div>
                            {errors.non_field_errors && (
                                <div className="alert alert-danger mb-3">{errors.non_field_errors}</div>
                            )}
                            {loading ? (
                                <button type='submit' className='btn btn-info d-block mx-auto' disabled>
                                    <FontAwesomeIcon icon={faSpinner} spin className='me-2' />Logging in...
                                </button>
                            ) : (
                                <button type='submit' className='btn btn-info d-block mx-auto'>Login</button>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
