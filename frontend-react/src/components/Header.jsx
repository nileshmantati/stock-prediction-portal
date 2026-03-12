import { useContext } from 'react'
import Button from './Button'
import { Link } from 'react-router-dom'
import { AuthContext } from '../AuthProvider'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'User';
    const handlelogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsLoggedIn(false)
        console.log("Logout successful!")
        navigate('/login')
    }
    return (
        <>
            <nav className='navbar container py-3 align-items-start'>
                <Link className='navbar-brand text-light' to='/'>Stock Predictions Portal</Link>
                <div>
                    {isLoggedIn ? (
                        <>
                            <span className='text-light text-capitalize me-3 fs-6'>{username}</span>
                            <button className="btn btn-danger" onClick={handlelogout}>Logout</button>
                        </>) :
                        (
                            <>
                                <Button text='Login' color="btn-outline-info" path="login" />
                                &nbsp;
                                <Button text='Register' color="btn-info" path="register" />
                            </>
                        )
                    }
                </div>
            </nav>
        </>
    )
}

export default Header
