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

// Register the required chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Chart = ({heading, data}: any) => {

    const chartData = {
        labels: [
            'January', 'February', 'March', 'April', 'May',
            'June', 'July', 'August', 'September', 'October',
            'November', 'December',
        ],
        datasets: [
            {
                label: 'Posts',
                data: data?.monthlyPublishedPostsCount?.map((data: any) => data.count),
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
                text: heading,
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
        <div style={{ height: "100%", width: "100%" }} className='mx-auto'>
            <Bar data={chartData} options={options} className='w-full h-full'/>
        </div>
    )
}

export default Chart