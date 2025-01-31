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



const RecentOrders = ({ data }: any) => {

  if(!data){
    return <div></div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 mt-2 text-center text-white">Recent Orders</h2>
      <div className="rounded-md border-[1px] border-gray-800">
        <Table>
          <TableHeader className="border-gray-800">
            <TableRow className="bg-gray-800">
              <TableHead className="px-4 py-2">Customer Name</TableHead>
              <TableHead className="px-4 py-2">Vendor Name</TableHead>
              <TableHead className="px-4 py-2">Total Product</TableHead>
              <TableHead className="px-4 py-2">Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-700">
            {
              data.length > 0 ? (
                data.map((order: any) => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-gray-700 cursor-pointer"
                  >
                    <TableCell className="px-4 py-2">{order?.user.name}</TableCell>
                    <TableCell className="px-4 py-2">{order?.vendor.name}</TableCell>
                    <TableCell className="px-4 py-2">{order?.items.length}</TableCell>
                    <TableCell className="px-4 py-2">Rs. {order?.totalAmount}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-2">No Orders Found</TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </div >
    </div >
  );
};

export default RecentOrders;
