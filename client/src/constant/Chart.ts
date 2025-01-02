export const chartOptions = (heading : string) => {
    return  {
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

export const chartData  = (data: any) => {
    return {
        labels: data?.map((data: any) => monthsArr[data.month -1]),
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
const monthsArr = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May',
    'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
    'Nov', 'Dec',
]