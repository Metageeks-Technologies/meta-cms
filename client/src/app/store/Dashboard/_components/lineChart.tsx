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
import { monthsArr, storeLineChartData, storeLineChartOption } from '@/constant/Chart';


// Register the required chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const LineChart = ({ data }: any) => {


    if(!data){
        return(
            <div></div>
        )
    }
    
    return (
        <div style={{ height: "100%", width: "100%", padding: '20px' }} className='mx-auto'>
            <Line data={storeLineChartData(data)} options={storeLineChartOption()} className='w-full h-full' />
        </div>
    )
}

export default LineChart;
