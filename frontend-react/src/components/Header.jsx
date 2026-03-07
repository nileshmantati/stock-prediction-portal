import React from 'react'
import Button from './Button'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <>
            <nav className='navbar container py-3 align-items-start'>
                <Link className='navbar-brand text-light' to='/'>Stock Predictions Portal</Link>
                <div >
                    <Button text='Login' color="btn-outline-info" path="login" />
                    &nbsp;
                    <Button text='Register' color="btn-info" path="register" />
                </div>
            </nav>
        </>
    )
}

export default Header
