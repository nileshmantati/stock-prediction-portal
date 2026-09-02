import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const FormInput = ({
    id,
    name,
    label,
    type = 'text',
    value,
    onChange,
    onBlur,
    placeholder,
    error,
    touched,
    icon,
    disabled = false,
    autoComplete = 'off',
    isPassword = false,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const isInvalid = Boolean(error && touched);
    const isValid = Boolean(!error && touched && value);

    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="mb-3 text-start">
            {label && (
                <label htmlFor={id || name} className="form-label text-light fs-6 fw-medium mb-1">
                    {label}
                </label>
            )}
            <div className="input-group custom-input-group">
                {icon && (
                    <span className={`input-group-text custom-input-icon ${isInvalid ? 'border-danger text-danger' : isValid ? 'border-success text-success' : ''}`}>
                        <FontAwesomeIcon icon={icon} />
                    </span>
                )}
                <input
                    id={id || name}
                    name={name}
                    type={inputType}
                    className={`form-control custom-form-input ${isInvalid ? 'is-invalid' : isValid ? 'is-valid' : ''}`}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete={autoComplete}
                />
                {isPassword && (
                    <button
                        type="button"
                        className={`btn custom-password-toggle ${isInvalid ? 'border-danger text-danger' : isValid ? 'border-success text-success' : ''}`}
                        onClick={() => setShowPassword((prev) => !prev)}
                        tabIndex={-1}
                        title={showPassword ? 'Hide password' : 'Show password'}
                    >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                )}
            </div>
            {isInvalid && (
                <div className="invalid-feedback d-flex align-items-center gap-1 mt-1 fs-7">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    <span>{Array.isArray(error) ? error.join(', ') : error}</span>
                </div>
            )}
        </div>
    );
};

export default FormInput;
