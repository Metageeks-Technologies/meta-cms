'use client'
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

import { PieData,PieOptions } from '@/constant/dummyStoreData';


// Register the required chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {

  

    return (
        <div style={{ height: "100%", width: "100%", padding: '20px' }} className='mx-auto'>
            <h1 className='font-bold text-center' >Top 5 Products</h1>
            <Doughnut data={PieData} options={PieOptions} className='w-full h-full' />
        </div>
    );
};

export default DoughnutChart;
