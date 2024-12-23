'use client';
import React, { useState } from 'react';
import { FaTrashAlt, FaBan, FaEnvelope, FaUndo } from 'react-icons/fa'; 
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const initialUsers = [
  { id: 1, name: 'John Doe', email: 'johndoe@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'janesmith@example.com', status: 'Inactive' },
  { id: 3, name: 'Michael Johnson', email: 'michaelj@example.com', status: 'Active' },
  { id: 4, name: 'Emma Watson', email: 'emmawatson@example.com', status: 'Inactive' },
  { id: 5, name: 'Olivia Brown', email: 'oliviabrown@example.com', status: 'Active' },
  { id: 6, name: 'Lucas White', email: 'lucaswhite@example.com', status: 'Inactive' },
  { id: 7, name: 'Sophia Green', email: 'sophiagreen@example.com', status: 'Active' },
  { id: 8, name: 'Liam Martin', email: 'liammartin@example.com', status: 'Inactive' },
  { id: 9, name: 'Charlotte Davis', email: 'charlottedavis@example.com', status: 'Active' },
  { id: 10, name: 'James Wilson', email: 'jameswilson@example.com', status: 'Inactive' },
];

function User() {
  const [users, setUsers] = useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'block' | 'unblock' | 'delete' | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const openModal = (action: 'block' | 'delete' | 'unblock', user: any) => {
    setActionType(action);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActionType(null);
    setSelectedUser(null);
  };

  const confirmAction = () => {
    if (actionType && selectedUser) {
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              status:
                actionType === 'block'
                  ? 'Blocked'
                  : actionType === 'unblock'
                  ? 'Inactive'
                  : actionType === 'delete'
                  ? 'Deleted'
                  : user.status,
            }
          : user
      );
      setUsers(updatedUsers);
      console.log(`${actionType} action confirmed for ${selectedUser.name}!`);
    }
    closeModal();
  };

  return (
    <div className="overflow-x-auto bg-black text-white p-7 rounded-lg">
      <Table className="min-w-full">
        <TableCaption className="text-3xl text-white">List of Users</TableCaption>

        <TableHeader>
          <TableRow className="text-2xl border-gray-900">
            <TableHead className="w-[150px] text-white">Name</TableHead>
            <TableHead className="w-[150px] text-white">Email</TableHead>
            <TableHead className="w-[150px] text-white">Status</TableHead>
            <TableHead className="w-[150px] text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="border-gray-900">
          {users.map((user) => (
            <TableRow className="border-gray-900" key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="flex items-center space-x-2">
                <FaEnvelope size={16} className="text-gray-500" />
                <span>{user.email}</span>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 text-xs font-semibold ${
                    user.status === 'Active'
                      ? 'text-green-500'
                      : user.status === 'Blocked'
                      ? 'text-yellow-500'
                      : user.status === 'Deleted'
                      ? 'text-red-500'
                      : 'text-gray-500'
                  }`}
                >
                  {user.status}
                </span>
              </TableCell>
              <TableCell className="flex justify-end space-x-4">
                {/* Show Block and Delete icons */}
                {user.status !== 'Deleted' && (
                  <>
                    {/* Show Block icon only when the user is not blocked */}
                    {user.status !== 'Blocked' && (
                      <button
                        onClick={() => openModal('block', user)}
                        className="text-yellow-400 hover:text-yellow-800 transition-colors duration-200"
                      >
                        <FaBan size={18} />
                      </button>
                    )}

                    {/* Show Unblock icon when the user is blocked */}
                    {user.status === 'Blocked' && (
                      <button
                        onClick={() => openModal('unblock', user)}
                        className="text-green-500 hover:text-green-800 transition-colors duration-200"
                      >
                        <FaUndo size={18} />
                      </button>
                    )}

                    {/* Show Delete icon for active/inactive/blocked users */}
                    {user.status !== 'Blocked' && (
                      <button
                        onClick={() => openModal('delete', user)}
                        className="text-red-500 hover:text-red-800 transition-colors duration-200"
                      >
                        <FaTrashAlt size={18} />
                      </button>
                    )}
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white text-black rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              Are you sure you want to {actionType} user: {selectedUser?.name}?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  actionType === 'block'
                    ? 'bg-yellow-600 text-white'
                    : actionType === 'unblock'
                    ? 'bg-green-600 text-white'
                    : actionType === 'delete'
                    ? 'bg-red-600 text-white'
                    : ''
                } hover:${actionType === 'block' ? 'bg-yellow-700' : actionType === 'unblock' ? 'bg-green-700' : 'bg-red-700'}`}
              >
                {actionType === 'block'
                  ? 'Block'
                  : actionType === 'unblock'
                  ? 'Unblock'
                  : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default User;
