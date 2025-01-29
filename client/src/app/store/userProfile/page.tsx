'use client';
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SimpleProfilePage: React.FC = () => {
  // Dummy user profile data
  const userProfile = {
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

  const [activeTab, setActiveTab] = useState('orders'); // Default to 'orders'

  const handleViewTab = (tab: 'orders' | 'address') => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="mx-auto max-w-4xl bg-gray-800 shadow-lg rounded-lg p-6 sm:p-8 md:p-10">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className='w-24 h-24'>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{userProfile.name}</h1>
            <p className="text-gray-400">{userProfile.email}</p>
            <p className="text-gray-400">{userProfile.phoneNo}</p>
            <p className="text-gray-400">{userProfile.role}</p>
          </div>
        </div>

        <div className="border-b border-gray-700 mb-4 pb-4">
          <h2 className="text-2xl font-semibold mb-2">Address:</h2>
          {userProfile.address.map((addr, idx) => (
            <div key={idx} className="text-gray-300 mb-2">
              {addr.houseNo}, {addr.street}, {addr.city}, {addr.state} {addr.postalCode}
            </div>
          ))}
        </div>

        <div className="flex gap-6 mb-4">
          <a
            onClick={() => handleViewTab('orders')}
            className={`px-4 py-2 text-lg font-semibold cursor-pointer ${activeTab === 'orders' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
          >
            Orders
          </a>
          <a
            onClick={() => handleViewTab('address')}
            className={`px-4 py-2 text-lg font-semibold cursor-pointer ${activeTab === 'address' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
          >
            Address
          </a>
        </div>

        <div>
          {activeTab === 'orders' ? (
            <div>
              <h3 className="text-2xl font-semibold mb-2">Order Details:</h3>
              {userProfile.orders.map(order => (
                <div key={order.id} className="bg-gray-700 p-4 rounded-lg mb-4">
                  <h4 className="text-xl font-bold text-blue-400">{order.name}</h4>
                  <p className="text-gray-300">Status: {order.status}</p>
                  <p className="text-gray-300">Items: {order.items.join(', ')}</p>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <h3 className="text-2xl font-semibold mb-2">Address List:</h3>
              {userProfile.address.map((addr, idx) => (
                <div key={idx} className="bg-gray-700 p-4 rounded-lg mb-4">
                  <p className="text-gray-300">
                    {addr.houseNo}, {addr.street}, {addr.city}, {addr.state} {addr.postalCode}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleProfilePage;
