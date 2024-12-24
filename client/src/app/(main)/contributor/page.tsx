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
import { useAuth } from '@/hooks/useAuth';
import { initialContributors } from '@/constant/user';


function Contributor() {

  useAuth();

  const [contributors, setContributors] = useState(initialContributors);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'remove' | 'add' | null>(null);
  const [selectedContributor, setSelectedContributor] = useState<any>(null);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(contributors.length / itemsPerPage);

  const openModal = (action: 'remove' | 'add', contributor: any) => {
    setActionType(action);
    setSelectedContributor(contributor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActionType(null);
    setSelectedContributor(null);
  };

  const confirmAction = () => {
    if (actionType && selectedContributor) {
      const updatedContributors = contributors.map((contributor) =>
        contributor.id === selectedContributor.id
          ? {
              ...contributor,
              role: actionType === 'remove' ? 'user' : 'contributor',
            }
          : contributor
      );
      setContributors(updatedContributors);
      console.log(`${actionType} action confirmed for ${selectedContributor.name}!`);
    }
    closeModal();
  };

  const currentContributors = contributors.slice(
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
        <TableCaption className="text-3xl text-white">List of Contributors</TableCaption>

        <TableHeader>
          <TableRow className="text-2xl border-gray-900">
            <TableHead className="w-[150px] text-white">Name</TableHead>
            <TableHead className="w-[150px] text-white">Email</TableHead>
            <TableHead className="w-[150px] text-white">Role</TableHead>
            <TableHead className="w-[150px] text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="border-gray-900">
          {currentContributors.map((contributor) => (
            <TableRow className="border-gray-900" key={contributor.id}>
              <TableCell className="font-medium">{contributor.name}</TableCell>
              <TableCell className="flex items-center space-x-2">
                <FaEnvelope size={16} className="text-gray-500" />
                <span>{contributor.email}</span>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 text-xs font-semibold ${
                    contributor.role === 'contributor' ? 'text-blue-500' : 'text-gray-500'
                  }`}
                >
                  {contributor.role === 'contributor' ? ' Contributor' : ' User'}
                </span>
              </TableCell>
              <TableCell className="flex justify-end space-x-4">
                {/* Show Remove icon only for contributors */}
                {contributor.role === 'contributor' && (
                  <button
                    onClick={() => openModal('remove', contributor)}
                    className="text-red-500 hover:text-red-800 transition-colors duration-200"
                    title="Remove from Contributors"
                  >
                    <FaUserMinus size={18} />
                  </button>
                )}
                {/* Show Add icon only for non-contributors */}
                {contributor.role === 'user' && (
                  <button
                    onClick={() => openModal('add', contributor)}
                    className="text-green-500 hover:text-green-800 transition-colors duration-200"
                    title="Add to Contributors"
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
                ? `Are you sure you want to remove ${selectedContributor?.name} as a Contributor?`
                : `Are you sure you want to add ${selectedContributor?.name} as a Contributor?`}
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
                {actionType === 'remove' ? 'Remove Contributor' : 'Add Contributor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contributor;
