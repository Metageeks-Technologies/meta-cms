// 'use client'
// import React from 'react'
// import { Bar } from 'react-chartjs-2';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend,
// } from 'chart.js';
// import { chartData, chartOptions } from '@/constant/Chart';

// // Register the required chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const Chart = ({heading, data}: any) => {


//     return (
//         <div style={{ height: "100%", width: "100%" }} className='mx-auto'>
//             <Bar data={chartData(data?.monthlyPublishedPostsCount)} options={chartOptions(heading)} className='w-full h-full'/>
//         </div>
//     )
// }

// export default Chart
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
import { chartData, chartOptions } from '@/constant/Chart';

// Register the required chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Chart = ({heading, data}: any) => {
    return (
        <div style={{ height: "30vh", minHeight: "300px", width: "100%",maxWidth: "1200px", }} className='mx-auto'>
            <Bar 
                data={chartData(data?.monthlyPublishedPostsCount)} 
                options={{
                    ...chartOptions(heading),
                    maintainAspectRatio: false,
                    responsive: true
                }} 
                className='w-full h-full'
            />
        </div>
    )
}

export default Chart