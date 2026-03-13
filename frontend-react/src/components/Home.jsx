import React from 'react'
import Button from './Button'
const Home = () => {
    return (
        <>
            <div className='container'>
                <div className="p-5 text-center bg-light-dark rounded">
                    <h1 className='text-light'>Stock Predictions Portal</h1>
                    <p className='text-light lead'>This portal provides accurate stock price predictions using advanced machine learning algorithms. Stay ahead in the stock market with our reliable forecasts and make informed investment decisions.</p>
                    <Button text='Explore Now' color="btn-outline-info" path="dashboard" />
                </div>
            </div>
        </>
    )
}

export default Home