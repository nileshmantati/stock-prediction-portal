import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosinstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Dashboard = () => {
    const [ticker, setTicker] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [plot, setPlot] = useState();
    const [ma100plot, setMA100Plot] = useState();
    const [ma200plot, setMA200Plot] = useState();
    const [prediction, setPrediction] = useState();
    const [mse, setMSE] = useState();
    const [rmse, setRMSE] = useState();
    const [r2, setR2] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('http://localhost:8000/api/v1/protected_view/');
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchData();

    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosInstance.post('http://localhost:8000/api/v1/predict/', { ticker: ticker });
            console.log(response.data);
            const backendRoot = import.meta.env.VITE_BACKEND_ROOT;
            const plotUrl = `${backendRoot}${response.data.plot_img}`
            const ma100plotUrl = `${backendRoot}${response.data.plot_img_100dma}`
            const ma200plotUrl = `${backendRoot}${response.data.plot_img_200dma}`
            const predictionUrl = `${backendRoot}${response.data.plot_prediction}`
            setPlot(plotUrl);
            setMA100Plot(ma100plotUrl);
            setMA200Plot(ma200plotUrl);
            setPrediction(predictionUrl);
            setMSE(response.data.mse);
            setRMSE(response.data.rmse);
            setR2(response.data.r2);
            // Set Plots
            if (response.data.error) {
                setError(response.data.error);
            }
        }
        catch (error) {
            console.error('There was an error making the API request:', error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <form onSubmit={handleSubmit}>
                        <input type="text" className='form-control' name="ticker" value={ticker} placeholder="Enter Stock Ticker here..." onChange={(e) => setTicker(e.target.value)} required />
                        <small>{error && <div className="text-danger">{error}</div>}</small>
                        <button type="submit" className='btn btn-info mt-3'>{
                            loading ? (
                                <span><FontAwesomeIcon icon={faSpinner} spin /> Please wait...</span>
                            ) : (
                                'See Prediction'
                            )
                        }</button>
                    </form>
                </div>
                {/* { Print prediction plots } */}
                {prediction && (<div className="prediction mt-5">
                    <div className="p-3">
                        {plot && (<img src={plot} alt="Prediction Plot" className='img-fluid' style={{ maxWidth: '100%' }} />)}
                    </div>
                    <div className="p-3">
                        {ma100plot && (<img src={ma100plot} alt="100-Day Moving Average Plot" className='img-fluid' style={{ maxWidth: '100%' }} />)}
                    </div>
                    <div className="p-3">
                        {ma200plot && (<img src={ma200plot} alt="200-Day Moving Average Plot" className='img-fluid' style={{ maxWidth: '100%' }} />)}
                    </div>
                    <div className="p-3">
                        {prediction && (<img src={prediction} alt="Final Prediction Plot" className='img-fluid' style={{ maxWidth: '100%' }} />)}
                    </div>
                    <div className="text-light p-3">
                        <h4>Model Evalulation</h4>
                        <p>Mean Squared Error (MSE) : {mse}</p>
                        <p>Root Mean Squared Error (RMSE) : {rmse}</p>
                        <p>R-Squared : {r2}</p>
                    </div>
                </div>)}
            </div>
        </div>
    );
};

export default Dashboard; 