'use client';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

const BarGraph = () => {
  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false }, 
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1000,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '60%',
        endingShape: 'rounded',
        borderRadius: 10, 
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ['January', 'February', 'March', 'April', 'May', 'June'
        ,'july','august','september','oktober','november','december'
      ],
      labels: {
        style: {
          colors: '#ddd', 
          fontSize: '12px', 
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#ddd',
          fontSize: '12px',
        },
      },
    },
    title: {
      text: 'Monthly Posts',
      align: 'center',
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#fff',
      },
    },
    fill: {
      opacity: 0.9, 
      colors: ['#00E396', '#FEB019', '#FF4560', '#775DD0', '#3F51B5', '#8E44AD'], 
    },
    grid: {
      borderColor: '#333', 
      strokeDashArray: 5,
    },
    tooltip: {
      theme: 'dark', 
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300,
          },
        },
      },
    ],
  };

  const series = [
    {
      name: 'Posts',
      data: [30, 40, 35, 50, 49, 55,34,60,57,20,50,34], 
    },
  ];

  return (
    <div className="bg-black p-6 rounded-lg shadow-lg">
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default BarGraph;
