'use client';
import React, { useState } from 'react';
import { FaTrashAlt, FaEdit, FaEllipsisH, FaPlus } from 'react-icons/fa'; // Add the 'plus' icon for the add button
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input'; // Assume you have an input component for search

const initialCategories = [
  { id: 1, name: 'Technology', description: 'Latest trends and innovations in tech', slug: 'technology' },
  { id: 2, name: 'Lifestyle', description: 'Tips and ideas for a balanced life', slug: 'lifestyle' },
  { id: 3, name: 'Travel', description: 'Exploring new destinations and experiences', slug: 'travel' },
  { id: 4, name: 'Health', description: 'Advice on wellness, fitness, and nutrition', slug: 'health' },
  { id: 5, name: 'Food', description: 'Recipes, culinary tips, and food reviews', slug: 'food' },
  { id: 6, name: 'Finance', description: 'Personal finance, budgeting, and investments', slug: 'finance' },
  { id: 7, name: 'Education', description: 'Learning resources and academic insights', slug: 'education' },
  { id: 8, name: 'Entertainment', description: 'Movies, TV shows, music, and more', slug: 'entertainment' },
];

function Category() {
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [activeAction, setActiveAction] = useState<number | null>(null); // Track active action button for each category
  const [isEditing, setIsEditing] = useState<boolean>(false); // Track if we are editing
  const [editedCategory, setEditedCategory] = useState<any | null>(null); // Store the category being edited
  const [isAdding, setIsAdding] = useState<boolean>(false); // Track if we are adding a new category
  const [newCategory, setNewCategory] = useState<any>({ name: '', description: '', slug: '' }); // Store the new category details

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination: Get the categories for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  // Handle the change in search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  // Handle page change for pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Delete category function
  const handleDelete = (category: any) => {
    setCategories(categories.filter(cat => cat.id !== category.id)); // Remove the category from the list
  };

  // Start editing category
  const handleEdit = (category: any) => {
    setEditedCategory(category); // Set category for editing
    setIsEditing(true); // Show editing form
  };

  // Handle editing form submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedCategory) {
      setCategories(categories.map((category) =>
        category.id === editedCategory.id ? editedCategory : category
      ));
    }
    setIsEditing(false); // Close the edit form
    setEditedCategory(null); // Clear the edited category
  };

  // Handle input change for editing
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedCategory) {
      setEditedCategory({
        ...editedCategory,
        [e.target.name]: e.target.value,
      });
    }
  };

  // Handle input change for adding new category
  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory({
      ...newCategory,
      [e.target.name]: e.target.value,
    });
  };

  // Handle adding a new category
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.name && newCategory.description && newCategory.slug) {
      const newId = categories.length + 1;
      setCategories([...categories, { id: newId, ...newCategory }]);
      setNewCategory({ name: '', description: '', slug: '' }); // Reset the form
      setIsAdding(false); // Close the add form
    }
  };

  return (
    <div className="overflow-x-auto bg-black text-white p-7 rounded-lg">
      <div className="mb-4 flex justify-between items-center flex-wrap">
        {/* Search bar */}
        <Input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search categories..."
          className="w-full sm:w-1/3 p-2 bg-gray-700 text-white rounded-lg mb-4 sm:mb-0"
        />
        {/* Add new category button */}
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          <FaPlus size={18} className="mr-2" /> Add Category
        </button>
      </div>

      <Table className="min-w-full">
        <TableCaption className="text-3xl text-white">Category List</TableCaption>

        <TableHeader>
          <TableRow className="text-2xl border-gray-900">
            <TableHead className="w-[50px] text-white">S.No</TableHead>
            <TableHead className="w-[150px] text-white">Name</TableHead>
            <TableHead className="w-[200px] text-white">Description</TableHead>
            <TableHead className="w-[150px] text-white">Slug</TableHead>
            <TableHead className="w-[150px] text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="border-gray-900">
          {currentCategories.map((category, index) => (
            <TableRow key={category.id} className="border-gray-900">
              <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="font-medium">{category.description}</TableCell>
              <TableCell className="font-medium">{category.slug}</TableCell>
              <TableCell className="relative">
                <button
                  onClick={() => setActiveAction(activeAction === category.id ? null : category.id)} // Toggle the popover
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <FaEllipsisH size={18} />
                </button>

                {/* Popover showing Edit/Delete options */}
                {activeAction === category.id && (
                  <div className="z-10 absolute right-0 top-0 w-40 bg-gray-800 text-white rounded-lg shadow-lg p-2">
                    <button
                      onClick={() => handleEdit(category)} // Edit function
                      className="w-full text-left px-4 py-1 hover:bg-blue-500 transition-colors duration-200"
                    >
                      <FaEdit size={18} className="inline mr-2" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category)} // Delete function
                      className="w-full text-left px-4 py-1 mt-2 hover:bg-red-500 transition-colors duration-200"
                    >
                      <FaTrashAlt size={18} className="inline mr-2" /> Delete
                    </button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Editing Form Modal or Inline Editing */}
      {isEditing && editedCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <form
            onSubmit={handleEditSubmit}
            className="bg-gray-800 p-6 rounded-lg w-full sm:w-96"
          >
            <h2 className="text-2xl text-white mb-4">Edit Category</h2>
            <div className="mb-4">
              <label htmlFor="name" className="block text-white">Name</label>
              <input
                type="text"
                name="name"
                value={editedCategory.name}
                onChange={handleEditChange}
                className="w-full p-2 bg-gray-700 text-white rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-white">Description</label>
              <input
                type="text"
                name="description"
                value={editedCategory.description}
                onChange={handleEditChange}
                className="w-full p-2 bg-gray-700 text-white rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="slug" className="block text-white">Slug</label>
              <input
                type="text"
                name="slug"
                value={editedCategory.slug}
                onChange={handleEditChange}
                className="w-full p-2 bg-gray-700 text-white rounded-lg"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Category Form Modal */}
      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <form
            onSubmit={handleAddSubmit}
            className="bg-gray-800 p-6 rounded-lg w-full sm:w-96"
          >
            <h2 className="text-2xl text-white mb-4">Add New Category</h2>
            <div className="mb-4">
              <label htmlFor="name" className="block text-white">Name</label>
              <input
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleAddChange}
                className="w-full p-2 bg-gray-700 text-white rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-white">Description</label>
              <input
                type="text"
                name="description"
                value={newCategory.description}
                onChange={handleAddChange}
                className="w-full p-2 bg-gray-700 text-white rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="slug" className="block text-white">Slug</label>
              <input
                type="text"
                name="slug"
                value={newCategory.slug}
                onChange={handleAddChange}
                className="w-full p-2 bg-gray-700 text-white rounded-lg"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center space-x-2">
          {Array.from({ length: Math.ceil(filteredCategories.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'} rounded-lg hover:bg-blue-600`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Category;
