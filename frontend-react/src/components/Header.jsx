import React from 'react'
import Button from './Button'

const Header = () => {
    return (
        <>
            <nav className='navbar container py-3 align-items-start'>
                <a className='navbar-brand text-light'>Stock Predictions Portal</a>
                <div >
                    <Button text='Login' color="btn-outline-info" />
                    &nbsp;
                    <Button text='Register' color="btn-info" />
                </div>
            </nav>
        </>
    )
}

export default Header
