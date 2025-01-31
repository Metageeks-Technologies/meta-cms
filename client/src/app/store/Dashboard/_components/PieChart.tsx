'use client'
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { storePieChartData, storePieChartOption } from '@/constant/Chart';


// Register the required chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({data}: any) => {

    if(!data){
        return <div></div>
    }
    


    return (
        <div style={{ height: "100%", width: "100%", padding: '20px' }} className='mx-auto'>
            <h1 className='font-bold text-center' >Top {data?.length} Products</h1>
            <Doughnut data={storePieChartData(data)} options={storePieChartOption(data)} className='w-full h-full' />
        </div>
    );
};

export default DoughnutChart;
