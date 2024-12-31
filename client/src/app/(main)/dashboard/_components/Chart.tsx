'use client'
import React from 'react'
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { chartData } from '@/constant/Chart';

// Register the required chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Chart = () => {

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Monthly Posts',
                color: '#fff',
                font: {
                    size: 20,
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: '#fff',
                },
                // grid: {
                //     color: 'rgba(255, 255, 255, 0.1)',
                // },
            },
            y: {
                ticks: {
                    color: '#fff',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
            },
        },
    };


    return (
        <div style={{ padding: '20px', borderRadius: '30px', height: "100%" }}>
            <Bar data={chartData} options={options} />
        </div>
    )
}

export default Chart