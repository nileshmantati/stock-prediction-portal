import React, { useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../../axiosinstance';

const Dashboard = () => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('http://127.0.0.1:8000/api/v1/protected_view');
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchData();

    }, []);

    return (
        <div className='text-light container mt-5'>
            <h1>Dashboard</h1>
            <p>If you see this, the component rendered successfully.</p>
        </div>
    );
};

export default Dashboard; 