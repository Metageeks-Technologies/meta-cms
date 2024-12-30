import React from 'react';
import CardsRow from './CardsRow';
import Chart from './Chart';
import RecentPosts from './RecentPosts';

const AdminDashboard = () => {
  return (
    <div className="container mx-auto">
      <CardsRow />

      <div className="w-[97%] mx-auto flex flex-row items-start justify-between">
        <div className="w-[59%]">
          <Chart />
        </div>
        <div className="w-[40%]">
          <RecentPosts />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;