import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faUser, faEnvelope, faLock, faUserPlus, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../axiosinstance';
import { registerSchema } from '../utils/validationSchemas';
import FormInput from './common/FormInput';
import FormAlert from './common/FormAlert';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [serverError, setServerError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Validate a single field using Yup schema
    const validateField = async (name, value, updatedFormData) => {
        try {
            await registerSchema.validateAt(name, updatedFormData || { ...formData, [name]: value });
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        } catch (err) {
            setErrors((prev) => ({ ...prev, [name]: err.message }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
        setServerError('');

        if (touched[name]) {
            validateField(name, value, newFormData);
        }

        // Re-validate confirmPassword if password changes and confirmPassword is already touched
        if (name === 'password' && touched.confirmPassword) {
            validateField('confirmPassword', newFormData.confirmPassword, newFormData);
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        validateField(name, value, formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        setSuccess(false);

        // Mark all fields as touched
        const allTouched = { username: true, email: true, password: true, confirmPassword: true };
        setTouched(allTouched);

        try {
            // Validate form using Yup schema
            await registerSchema.validate(formData, { abortEarly: false });
            setErrors({});
            setLoading(true);

            // Send registration payload (username, email, password) to backend API
            const payload = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
            };

            await axiosInstance.post('register/', payload);
            setFormData({ username: '', email: '', password: '', confirmPassword: '' });
            setTouched({});
            setSuccess(true);

            // Delay navigation so success banner is shown clearly
            setTimeout(() => navigate('/login'), 1800);
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
                        // Field-specific backend errors (e.g., username already exists)
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
                <div className="col-12 col-sm-10 col-md-8 col-lg-6">
                    <div className="card border-0 shadow-lg bg-light-dark rounded-4 overflow-hidden">
                        <div className="card-header bg-transparent text-center border-0 pt-4 pb-2">
                            <div className="sidebar-brand-icon mx-auto mb-3" style={{ width: '48px', height: '48px', fontSize: '1.4rem' }}>
                                <FontAwesomeIcon icon={faUserPlus} className="text-white" />
                            </div>
                            <h3 className="text-light fw-bold mb-1">Create an Account</h3>
                            <p className="text-secondary small">Join the Stock Predictions Portal today</p>
                        </div>

                        <div className="card-body p-4 pt-2">
                            <FormAlert type="danger" message={serverError} onClose={() => setServerError('')} />

                            {success && (
                                <FormAlert
                                    type="success"
                                    message="Registration successful! Redirecting you to the login page..."
                                />
                            )}

                            <form onSubmit={handleSubmit} noValidate>
                                <FormInput
                                    id="username"
                                    name="username"
                                    label="Username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Choose a username"
                                    error={errors.username}
                                    touched={touched.username}
                                    icon={faUser}
                                    disabled={loading || success}
                                    autoComplete="username"
                                />

                                <FormInput
                                    id="email"
                                    name="email"
                                    label="Email Address"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="name@example.com"
                                    error={errors.email}
                                    touched={touched.email}
                                    icon={faEnvelope}
                                    disabled={loading || success}
                                    autoComplete="email"
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
                                    placeholder="Create a strong password"
                                    error={errors.password}
                                    touched={touched.password}
                                    icon={faLock}
                                    disabled={loading || success}
                                    autoComplete="new-password"
                                />

                                <FormInput
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    isPassword={true}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Repeat your password"
                                    error={errors.confirmPassword}
                                    touched={touched.confirmPassword}
                                    icon={faLock}
                                    disabled={loading || success}
                                    autoComplete="new-password"
                                />

                                <div className="d-grid gap-2 mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-predict py-2.5 fs-6 fw-semibold d-flex align-items-center justify-content-center gap-2"
                                        disabled={loading || success}
                                    >
                                        {loading ? (
                                            <>
                                                <FontAwesomeIcon icon={faSpinner} spin />
                                                <span>Creating account...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FontAwesomeIcon icon={faUserPlus} />
                                                <span>Register Account</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="card-footer bg-transparent border-top border-secondary border-opacity-25 text-center py-3">
                            <p className="text-secondary mb-0 small">
                                Already have an account?{' '}
                                <Link to="/login" className="text-info text-decoration-none fw-semibold">
                                    <FontAwesomeIcon icon={faSignInAlt} className="me-1" />
                                    Sign In here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;