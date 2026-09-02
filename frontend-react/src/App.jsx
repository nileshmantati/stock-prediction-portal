import './assets/css/style.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import AuthProvider from './AuthProvider';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

// Wraps public pages with the shared navbar + footer
const PublicLayout = ({ children }) => (
    <div className="d-flex flex-column min-vh-100">
        <Header />
        <div className="container py-4 d-flex flex-grow-1 align-items-center justify-content-center">
            {children}
        </div>
        <Footer />
    </div>
);

// Decides whether to use the public layout based on the current route
const AppRoutes = () => {
    const location = useLocation();
    const isDashboard = location.pathname.startsWith('/dashboard');

    return (
        <>
            {isDashboard ? (
                <Routes>
                    <Route
                        path="/dashboard"
                        element={<PrivateRoute><Dashboard /></PrivateRoute>}
                    />
                    {/* Fix #16: Catch-all for unknown /dashboard/* paths */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            ) : (
                <PublicLayout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        {/* Fix #16: Catch-all for unknown public paths */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </PublicLayout>
            )}
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
