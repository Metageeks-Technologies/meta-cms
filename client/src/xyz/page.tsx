'use client';

import React, { useState } from 'react';
import {
  AiOutlineDashboard,
  AiOutlineFileText,
  AiOutlineUser,
  AiOutlineSetting,
} from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';
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
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BlogDashboard: React.FC = () => {
  const [recentPosts] = useState([
    { title: 'Understanding React', author: 'Jane Doe', date: 'Dec 10, 2024', status: 'Published' },
    { title: 'Next.js Basics', author: 'John Smith', date: 'Dec 9, 2024', status: 'Draft' },
    { title: 'Styling in Tailwind', author: 'Alice Brown', date: 'Dec 8, 2024', status: 'Published' },
  ]);

  const [analyticsData] = useState({
    posts: 120,
    users: 85,
    comments: 450,
    views: [300, 400, 500, 700, 650],
  });

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Views per Month',
        data: analyticsData.views,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        </div>
        <nav className="mt-6">
          <ul className="space-y-4">
            <li className="flex items-center p-3 hover:bg-gray-700 rounded-md cursor-pointer">
              <AiOutlineDashboard className="w-6 h-6 mr-3" />
              Dashboard
            </li>
            <li className="flex items-center p-3 hover:bg-gray-700 rounded-md cursor-pointer">
              <AiOutlineFileText className="w-6 h-6 mr-3" />
              Posts
            </li>
            <li className="flex items-center p-3 hover:bg-gray-700 rounded-md cursor-pointer">
              <FaRegComment className="w-6 h-6 mr-3" />
              Comments
            </li>
            <li className="flex items-center p-3 hover:bg-gray-700 rounded-md cursor-pointer">
              <AiOutlineUser className="w-6 h-6 mr-3" />
              Users
            </li>
            <li className="flex items-center p-3 hover:bg-gray-700 rounded-md cursor-pointer">
              <AiOutlineSetting className="w-6 h-6 mr-3" />
              Settings
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">Dashboard Overview</h2>
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none"
          />
        </header>

        {/* Analytics Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Total Posts</h3>
            <p className="text-3xl mt-2 font-bold">{analyticsData.posts}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Active Users</h3>
            <p className="text-3xl mt-2 font-bold">{analyticsData.users}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Comments</h3>
            <p className="text-3xl mt-2 font-bold">{analyticsData.comments}</p>
          </div>
        </section>

        {/* Analytics Chart */}
        <section className="mb-6">
          <h3 className="text-2xl font-semibold mb-4">Analytics</h3>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <Line data={chartData} />
          </div>
        </section>

        {/* Recent Posts Table */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">Recent Posts</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 text-left text-gray-300">
              <thead>
                <tr>
                  <th className="p-4 font-medium text-white">Title</th>
                  <th className="p-4 font-medium text-white">Author</th>
                  <th className="p-4 font-medium text-white">Date</th>
                  <th className="p-4 font-medium text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.map((post, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="p-4">{post.title}</td>
                    <td className="p-4">{post.author}</td>
                    <td className="p-4">{post.date}</td>
                    <td className={`p-4 ${post.status === 'Published' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {post.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BlogDashboard;
