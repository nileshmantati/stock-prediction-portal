import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faUser, faLock, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../axiosinstance';
import { AuthContext } from '../AuthProvider';
import { loginSchema } from '../utils/validationSchemas';
import FormInput from './common/FormInput';
import FormAlert from './common/FormAlert';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { setIsLoggedIn } = useContext(AuthContext);

    // Validate a single field using Yup schema
    const validateField = async (name, value) => {
        try {
            await loginSchema.validateAt(name, { ...formData, [name]: value });
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        } catch (err) {
            setErrors((prev) => ({ ...prev, [name]: err.message }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setServerError('');

        if (touched[name]) {
            validateField(name, value);
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        setLoading(true);

        // Mark all fields as touched
        const allTouched = { username: true, password: true };
        setTouched(allTouched);

        try {
            // Validate all fields using Yup schema
            await loginSchema.validate(formData, { abortEarly: false });
            setErrors({});

            // Make API login request
            const response = await axiosInstance.post('token/', formData);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('username', formData.username);
            setIsLoggedIn(true);
            navigate('/dashboard');
        } catch (err) {
            if (err.name === 'ValidationError') {
                // Yup validation errors
                const validationErrors = {};
                err.inner.forEach((error) => {
                    validationErrors[error.path] = error.message;
                });
                setErrors(validationErrors);
            } else {
                // Server/API errors
                const data = err.response?.data;
                if (data) {
                    if (data.detail) {
                        setServerError(data.detail);
                    } else if (data.non_field_errors) {
                        setServerError(Array.isArray(data.non_field_errors) ? data.non_field_errors.join(' ') : data.non_field_errors);
                    } else {
                        // Field specific backend errors
                        setErrors(data);
                    }
                } else {
                    setServerError('Server is unreachable. Please check your connection and try again.');
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-5">
                    <div className="card border-0 shadow-lg bg-light-dark rounded-4 overflow-hidden">
                        <div className="card-header bg-transparent text-center border-0 pt-4 pb-2">
                            <div className="sidebar-brand-icon mx-auto mb-3" style={{ width: '48px', height: '48px', fontSize: '1.4rem' }}>
                                <FontAwesomeIcon icon={faSignInAlt} className="text-white" />
                            </div>
                            <h3 className="text-light fw-bold mb-1">Welcome Back</h3>
                            <p className="text-secondary small">Sign in to your Stock Predictions account</p>
                        </div>

                        <div className="card-body p-4 pt-2">
                            <FormAlert type="danger" message={serverError} onClose={() => setServerError('')} />

                            <form onSubmit={handleSubmit} noValidate>
                                <FormInput
                                    id="username"
                                    name="username"
                                    label="Username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter your username"
                                    error={errors.username}
                                    touched={touched.username}
                                    icon={faUser}
                                    disabled={loading}
                                    autoComplete="username"
                                />

                                <FormInput
                                    id="password"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    isPassword={true}
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter your password"
                                    error={errors.password}
                                    touched={touched.password}
                                    icon={faLock}
                                    disabled={loading}
                                    autoComplete="current-password"
                                />

                                <div className="d-grid gap-2 mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-predict py-2.5 fs-6 fw-semibold d-flex align-items-center justify-content-center gap-2"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <FontAwesomeIcon icon={faSpinner} spin />
                                                <span>Logging in...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FontAwesomeIcon icon={faSignInAlt} />
                                                <span>Sign In</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="card-footer bg-transparent border-top border-secondary border-opacity-25 text-center py-3">
                            <p className="text-secondary mb-0 small">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-info text-decoration-none fw-semibold">
                                    <FontAwesomeIcon icon={faUserPlus} className="me-1" />
                                    Register here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
