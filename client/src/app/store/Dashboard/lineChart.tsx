'use client'
import React from 'react'
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

import { LineData, LineOptions } from '@/constant/dummyStoreData';

// Register the required chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const LineChart = () => {
  

  

    return (
        <div style={{ height: "100%", width: "100%", padding: '20px' }} className='mx-auto'>
            <Line data={LineData} options={LineOptions} className='w-full h-full' />
        </div>
    )
}

export default LineChart;
