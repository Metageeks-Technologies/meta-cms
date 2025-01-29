export const PieData = {
    labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
    datasets: [
        {
            label: 'Top 5 Products',
            data: [300, 200, 150, 100, 50],
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


export const PieOptions: any = {
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




export const LineData = {
    labels: [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ],
    datasets: [
        {
            label: 'Monthly Sales',
            data: [30, 50, 70, 60, 90, 80, 100, 120, 110, 150, 130, 160],
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


export const LineOptions: any = {
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
                    return `${tooltipItem.dataset.label}: $${tooltipItem.raw}`;
                },
            },
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: 'white',
            bodyColor: '#333',
        },
        title: {
            display: true,
            text: 'Monthly Sales Data',
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



// Dummy data for recent orders
export const dummyOrders = [
    { id: 1, customerName: 'John Doe', productName: 'Product A', totalOrders: 2, totalAmount: 50.00 },
    { id: 2, customerName: 'Jane Smith', productName: 'Product B', totalOrders: 1, totalAmount: 20.00 },
    { id: 3, customerName: 'Alice Johnson', productName: 'Product C', totalOrders: 3, totalAmount: 75.00 },
    { id: 4, customerName: 'Bob Brown', productName: 'Product D', totalOrders: 4, totalAmount: 100.00 },
    { id: 5, customerName: 'Charlie Davis', productName: 'Product E', totalOrders: 2, totalAmount: 40.00 },
    { id: 6, customerName: 'Dana Lee', productName: 'Product F', totalOrders: 1, totalAmount: 15.00 },
    { id: 7, customerName: 'Emily Clark', productName: 'Product G', totalOrders: 5, totalAmount: 125.00 },
    { id: 8, customerName: 'Frank Harris', productName: 'Product H', totalOrders: 2, totalAmount: 60.00 },
    { id: 9, customerName: 'Grace White', productName: 'Product I', totalOrders: 3, totalAmount: 90.00 },
    { id: 10, customerName: 'Henry Adams', productName: 'Product J', totalOrders: 1, totalAmount: 30.00 },
    { id: 11, customerName: 'Isabella Thompson', productName: 'Product K', totalOrders: 4, totalAmount: 110.00 },

];


interface Product {
    name: string;
    updatedDate: string;
    imageUrl: string;
  }

export const products: Product[] = [
    {
      name: "Soja & Co. Eucalyptus",
      updatedDate: "Mar 8, 2024",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlODRk_O003vlcnQmEpBnpU-gTHhUmhSPOhg&s"
    },
    {
      name: "Necessaire Body Lotion",
      updatedDate: "Mar 8, 2024",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdhgRzwYTa7wCJ8bK17xvSK1IjAyUpmF4HyA&s",
    },
    {
      name: "Ritual of Sakura",
      updatedDate: "Mar 8, 2024",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIOx_Jr8S8l2GD5xpj6b3GDTW3joonJLdruw&s",
    },
    {
      name: "Lancome Rouge",
      updatedDate: "Mar 8, 2024",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXqsMS5j2M4TT1YbMEU8DU1oxMktkRMEmBtQ&s",
    },
    {
      name: "Erbology Aloe Vera",
      updatedDate: "Mar 8, 2024",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwfsgP207H7OBptwS0TFFot_4GyORQxXiupTWvgv021MGzywcCRbZJDfwHXQCC7BKwluo&usqp=CAU",
    },
  ];





 export const userProfile = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phoneNo: "9876543210",
    role: 'user',
    address: [
      {
        houseNo: "123",
        street: "Main St",
        city: "New York",
        state: "NY",
        postalCode: "123456",
      },
      {
        houseNo: "456",
        street: "Second St",
        city: "New York",
        state: "NY",
        postalCode: "654321",
      }
    ],
    orders: [
      {
        id: 1,
        name: "Order #1",
        status: "Delivered",
        items: ["Item 1", "Item 2", "Item 3"],
      },
      {
        id: 2,
        name: "Order #2",
        status: "On the way",
        items: ["Item A", "Item B"],
      }
    ]
  };