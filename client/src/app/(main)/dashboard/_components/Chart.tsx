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
import { BiBorderRadius } from 'react-icons/bi';

// Register the required chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Chart = () => {

    const data = {
        labels: [
            'January', 'February', 'March', 'April', 'May',
            'June', 'July', 'August', 'September', 'October',
            'November', 'December',
        ],
        datasets: [
            {
                label: 'Posts',
                data: [30, 40, 35, 50, 55, 60, 40, 60, 55, 20, 35, 40], // Example data
                backgroundColor: 'rgba(0, 255, 128, 0.8)',
                borderColor: 'rgba(0, 255, 128, 1)',
                borderWidth: 1,
                borderRadius: 10
            },
        ],
    };

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
            <Bar data={data} options={options} />
        </div>
    )
}

export default Chart