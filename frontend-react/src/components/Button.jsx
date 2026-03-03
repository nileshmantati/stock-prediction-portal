import React from 'react'

const Button = (props) => {
    return (
        <>
            <a href="#" className={`btn ${props.color}`}>{props.text}</a>
        </>
    )
}

export default Button