import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
    username: Yup.string()
        .trim()
        .required('Username is required'),
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
});

export const registerSchema = Yup.object().shape({
    username: Yup.string()
        .trim()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username cannot exceed 20 characters')
        .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: Yup.string()
        .trim()
        .required('Email address is required')
        .email('Please enter a valid email address'),
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string()
        .required('Please confirm your password')
        .oneOf([Yup.ref('password'), null], 'Passwords do not match')
});
