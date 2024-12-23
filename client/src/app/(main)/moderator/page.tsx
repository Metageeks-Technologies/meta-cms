'use client';
import React, { useState } from 'react';
import { FaEnvelope, FaUserMinus, FaUserPlus } from 'react-icons/fa';
import { MdArrowForward, MdArrowBack } from 'react-icons/md';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const initialAdmins = [
  { id: 2, name: 'Alice Johnson', email: 'alicejohnson@example.com', role: 'moderator' },
  { id: 3, name: 'Bob Brown', email: 'bobbrown@example.com', role: 'moderator' },
  { id: 4, name: 'Charlie Williams', email: 'charliewilliams@example.com', role: 'moderator' },
  { id: 5, name: 'David Lee', email: 'davidlee@example.com', role: 'moderator' },
  { id: 6, name: 'Emma Davis', email: 'emmadavis@example.com', role: 'user' },
  { id: 7, name: 'Frank Harris', email: 'frankharris@example.com', role: 'user' },
  { id: 8, name: 'Grace Clark', email: 'graceclark@example.com', role: 'user' },
  { id: 9, name: 'Hannah Lewis', email: 'hannahlewis@example.com', role: 'user' },
  { id: 10, name: 'Ian Young', email: 'ianyoung@example.com', role: 'user' },
  { id: 11, name: 'Jack Martin', email: 'jackmartin@example.com', role: 'user' },
];

function Admin() {
  const [admins, setAdmins] = useState(initialAdmins);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'remove' | 'add' | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(admins.length / itemsPerPage);

  const openModal = (action: 'remove' | 'add', admin: any) => {
    setActionType(action);
    setSelectedAdmin(admin);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActionType(null);
    setSelectedAdmin(null);
  };

  const confirmAction = () => {
    if (actionType && selectedAdmin) {
      const updatedAdmins = admins.map((admin) =>
        admin.id === selectedAdmin.id
          ? {
              ...admin,
              role: actionType === 'remove' ? 'user' : 'moderator',
            }
          : admin
      );
      setAdmins(updatedAdmins);
      console.log(`${actionType} action confirmed for ${selectedAdmin.name}!`);
    }
    closeModal();
  };

  const currentAdmins = admins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePagination = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="overflow-x-auto bg-black text-white p-7 rounded-lg">
      <Table className="min-w-full">
        <TableCaption className="text-3xl text-white">List of Moderators</TableCaption>

        <TableHeader>
          <TableRow className="text-2xl border-gray-900">
            <TableHead className="w-[150px] text-white">Name</TableHead>
            <TableHead className="w-[150px] text-white">Email</TableHead>
            <TableHead className="w-[150px] text-white">Role</TableHead>
            <TableHead className="w-[150px] text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="border-gray-900">
          {currentAdmins.map((admin) => (
            <TableRow className="border-gray-900" key={admin.id}>
              <TableCell className="font-medium">{admin.name}</TableCell>
              <TableCell className="flex items-center space-x-2">
                <FaEnvelope size={16} className="text-gray-500" />
                <span>{admin.email}</span>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 text-xs font-semibold ${
                    admin.role === 'moderator' ? 'text-green-500' : 'text-gray-500'
                  }`}

                >
                  {admin.role.charAt(0).toUpperCase() + admin.role.slice(1)}
                </span>
              </TableCell>
              <TableCell className="flex justify-end space-x-4">
                {/* Show Remove icon only for moderators */}
                {admin.role === 'moderator' && (
                  <button
                    onClick={() => openModal('remove', admin)}
                    className="text-red-500 hover:text-red-800 transition-colors duration-200"
                  >
                    <FaUserMinus size={18} />
                  </button>
                )}
                {/* Show Add icon only for users */}
                {admin.role === 'user' && (
                  <button
                    onClick={() => openModal('add', admin)}
                    className="text-green-500 hover:text-green-800 transition-colors duration-200"
                  >
                    <FaUserPlus size={18} />
                  </button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePagination('prev')}
          className="text-white bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
          disabled={currentPage === 1}
        >
          <MdArrowBack size={20} />
        </button>
        <span className="text-white">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => handlePagination('next')}
          className="text-white bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
          disabled={currentPage === totalPages}
        >
          <MdArrowForward size={20} />
        </button>
      </div>

      {/* Modal for Add/Remove Action */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white text-black rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              {actionType === 'remove'
                ? `Are you sure you want to demote ${selectedAdmin?.name} to User?`
                : `Are you sure you want to promote ${selectedAdmin?.name} to Moderator?`}
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
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {actionType === 'remove' ? 'Demote to User' : 'Promote to Moderator'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;