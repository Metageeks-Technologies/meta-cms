export const chartOptions = (heading: string) => {
    return {
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
}

export const chartData = (data: any) => {
    return {
        labels: data?.map((data: any) => monthsArr[data.month - 1]),
        datasets: [
            {
                label: 'Posts',
                data: data?.map((data: any) => data.count),
                backgroundColor: 'rgba(0, 255, 128, 0.8)',
                borderColor: 'rgba(0, 255, 128, 1)',
                borderWidth: 1,
                borderRadius: 10
            },
        ],
    };
}



export const storeLineChartOption = () => {
    const LineOptions: any = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white',
                    font: {
                        size: 14,
                        weight: 'bold',
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: { dataset: { label: any; }; raw: any; }) {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                    },
                },
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: 'black',
                bodyColor: '#333',
            },
            title: {
                display: true,
                text: 'Monthly Orders Data',
                font: {
                    size: 20,
                    weight: 'bold',

                },
                color: 'white',
                padding: {
                    bottom: 20,
                },
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(200, 200, 200, 0.5)',
                },
                ticks: {
                    color: '#fff',
                    font: {
                        size: 12,
                    },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(200, 200, 200, 0.5)',
                },
                ticks: {
                    color: '#fff',
                    font: {
                        size: 12,
                    },
                },
            },
        },
    };

    return LineOptions
}


export const storeLineChartData = (data: any) => {
    const LineData = {
        labels: [
            ...data?.map((data: any) => monthsArr[data.month - 1])
        ],
        datasets: [
            {
                label: 'Monthly Orders',
                data: [...data?.map((data: any) => data.count)],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.3,
                pointRadius: 6,
                pointHoverRadius: 8,
                borderWidth: 3,
            },
        ],
    };

    return LineData;
}


export const storePieChartOption = (data: any) => {
    const PieOptions: any = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#fff',
                    font: {
                        size: 14,
                        weight: 'bold',
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: { label: any; raw: any; }) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}`;
                    },
                },
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#333',
                bodyColor: '#333',
            },
        },
    };

    return PieOptions
}


export const storePieChartData = (data: any) => {
    const PieData = {
        labels: [...data?.map((data: any) => data.product.title)],
        datasets: [
            {
                label: `Top ${data.length} Products`,
                data: [...data?.map((data: any) => data.totalSoldQuantity)],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                ],
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 2,
            },
        ],
    };

    return PieData;
}



export const monthsArr = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May',
    'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
    'Nov', 'Dec',
]