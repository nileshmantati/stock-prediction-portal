import { Link } from 'react-router-dom'

const Button = ({ path, color, text }) => {
    return (
        <>
            <Link to={path} className={`btn ${color}`}>{text}</Link>
        </>
    )
}

export default Button