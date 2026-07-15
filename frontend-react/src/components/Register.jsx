import { useState } from 'react';
import axiosInstance from '../axiosinstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            await axiosInstance.post('register/', formData);
            setFormData({ username: '', email: '', password: '' });
            setSuccess(true);
            navigate('/login');
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
                        <h3 className='text-light text-center'>Create an Account</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <input type="text" className='form-control mb-1' value={formData.username} onChange={handleChange} name='username' placeholder='Enter Username' />
                                <small>{errors.username && <div className="text-danger">{errors.username}</div>}</small>
                            </div>
                            <div className="mb-3">
                                <input type="email" className='form-control mb-1' value={formData.email} onChange={handleChange} name="email" placeholder='Enter Email' />
                                <small>{errors.email && <div className="text-danger">{errors.email}</div>}</small>
                            </div>
                            <div className="mb-3">
                                <input type="password" className='form-control mb-1' value={formData.password} onChange={handleChange} name="password" placeholder='Enter Password' />
                                <small>{errors.password && <div className="text-danger">{errors.password}</div>}</small>
                            </div>
                            {errors.non_field_errors && (
                                <div className="alert alert-danger mb-3">{errors.non_field_errors}</div>
                            )}
                            {success && <div className="alert alert-success mb-3">Registration successful!</div>}
                            {loading ? (
                                <button type='submit' className='btn btn-info d-block mx-auto' disabled>
                                    <FontAwesomeIcon icon={faSpinner} spin className='me-2' />Please Wait...
                                </button>
                            ) : (
                                <button type='submit' className='btn btn-info d-block mx-auto'>Register</button>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;