'use client';
import React, { useEffect, useState } from 'react';
import { useUserContext } from '@/context/userContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { dummyOrders } from '@/constant/dummyStoreData';


const RecentOrders = () => {
  const { user } = useUserContext();
  const [orders, setOrders] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const fetchRecentOrders = () => {
    setIsLoading(true);
    setTimeout(() => {
      setOrders(dummyOrders);
      setIsLoading(false);
    }, 1000); // Simulate loading time
  };

  useEffect(() => {
    if (user.role) fetchRecentOrders();
  }, [user]);

  return (
<div>
  <h2 className="text-2xl font-bold mb-6 mt-2 text-center text-white">Recent Orders</h2>
      <div className="rounded-md border-[1px] border-gray-800">
        <Table>
          <TableHeader className="border-gray-800">
            <TableRow className="bg-gray-800">
              <TableHead className="px-4 py-2">Customer Name</TableHead>
              <TableHead className="px-4 py-2">Product Name</TableHead>
              <TableHead className="px-4 py-2">Total Orders</TableHead>
              <TableHead className="px-4 py-2">Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-700">
            {!isLoading ? (
              orders.length > 0 ? (
                orders.map((order: any) => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-gray-700 cursor-pointer"
                  >
                    <TableCell className="px-4 py-2">{order.customerName}</TableCell>
                    <TableCell className="px-4 py-2">{order.productName}</TableCell>
                    <TableCell className="px-4 py-2">{order.totalOrders}</TableCell>
                    <TableCell className="px-4 py-2">${order.totalAmount.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-2">No Orders Found</TableCell>
                </TableRow>
              )
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-2">Loading...</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecentOrders;
