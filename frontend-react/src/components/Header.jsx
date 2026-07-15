import { useContext } from 'react'
import Button from './Button'
import { Link } from 'react-router-dom'
import { AuthContext } from '../AuthProvider'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'User';
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        navigate('/login');
    };
    return (
        <>
            <nav className='navbar public-navbar container-fluid px-4 py-3 align-items-center'>
                <Link className='navbar-brand text-light' to='/'>Stock Predictions Portal</Link>
                <div>
                    {isLoggedIn ? (
                        <>
                            <span className='text-light text-capitalize fs-6'>{username}</span>
                            &nbsp;
                            <Button text='Dashboard' color="btn-outline-info" path="/dashboard" />
                            &nbsp;
                            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                        </>) :
                        (
                            <>
                                <Button text='Login' color="btn-outline-info" path="/login" />
                                &nbsp;
                                <Button text='Register' color="btn-info" path="/register" />
                            </>
                        )
                    }
                </div>
            </nav>
        </>
    )
}

export default Header
