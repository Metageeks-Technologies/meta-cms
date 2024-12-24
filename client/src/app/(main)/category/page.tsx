'use client';
import React, { useState, useEffect } from 'react';
import { FaTrashAlt, FaEdit, FaEllipsisH, FaPlus } from 'react-icons/fa';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import axiosCall from '../../../utils/ApiCall';



function Category() {

  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedCategory, setEditedCategory] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<any>({ name: '', description: '', bannerImageKey: '' });

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await axiosCall('GET', `${process.env.NEXT_PUBLIC_BASE_URL}/categories`);
      setCategories(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);


  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );


  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (category: any) => {
    try {
      // delete categorie
      await axiosCall('DELETE', `${process.env.NEXT_PUBLIC_BASE_URL}/categories/${category.id}`);
      setCategories(categories.filter(cat => cat.id !== category.id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleEdit = (category: any) => {
    setEditedCategory(category);
    setIsEditing(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editedCategory) {
      try {
        // update by id
        const response = await axiosCall('PATCH', `${process.env.NEXT_PUBLIC_BASE_URL}/categories/${editedCategory.id}`, editedCategory);
        setCategories(categories.map((category) =>
          category.id === editedCategory.id ? { ...editedCategory, ...response } : category
        ));
        setIsEditing(false);
        setEditedCategory(null);
        setActiveAction(null);
      } catch (error) {
        console.error('Error editing category:', error);
      }
    }
  };


  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedCategory) {
      setEditedCategory({
        ...editedCategory,
        [e.target.name]: e.target.value,
      });
    }
  };


  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory({
      ...newCategory,
      [e.target.name]: e.target.value,
    });
  };


  // add new category
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.name && newCategory.description && newCategory.bannerImageKey) {
      try {
        // post new category
        const response = await axiosCall('POST', `${process.env.NEXT_PUBLIC_BASE_URL}/categories`, newCategory);
        setCategories([...categories, response]);
        setNewCategory({ name: '', description: '', bannerImageKey: '' });
        setIsAdding(false);
      } catch (error) {
        console.error('Error adding category:', error);
      }
    } else {
      console.error('All fields are required to add a category');
    }
  };


  return (
    <div className="overflow-x-auto bg-black text-white p-7 rounded-lg">
      <div className="mb-4 flex justify-between items-center flex-wrap">
        <Input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search categories..."
          className="w-full sm:w-1/3 p-2 bg-gray-700 text-white rounded-lg mb-4 sm:mb-0"
        />
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
            <TableHead className="w-[150px] text-white">Banner Image Key</TableHead>
            <TableHead className="w-[150px] text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="border-gray-900">
          {currentCategories.map((category, index) => (
            <TableRow key={category.id} className="border-gray-900">
              <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="font-medium">{category.description}</TableCell>
              <TableCell className="font-medium">{category.bannerImageKey}</TableCell>
              <TableCell className="relative">
                <button
                  onClick={() => {
                    // Toggle activeAction between current category and null
                    setActiveAction(prevState => prevState === category.id ? null : category.id);
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <FaEllipsisH size={18} />
                </button>
                {/* Render dropdown only for the active category */}
                {activeAction === category.id && (
                  <div className="z-10 absolute right-0 top-0 w-40 bg-gray-800 text-white rounded-lg shadow-lg p-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="w-full text-left px-4 py-1 hover:bg-blue-500 transition-colors duration-200"
                    >
                      <FaEdit size={18} className="inline mr-2" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
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
      {isEditing && editedCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <form onSubmit={handleEditSubmit} className="bg-gray-800 p-6 rounded-lg w-full sm:w-96">
            <h2 className="text-2xl text-white mb-4">Edit Category</h2>
            <div>
              <label className="block text-white mb-2" htmlFor="name">Category Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={editedCategory.name}
                onChange={handleEditChange}
                className="w-full p-2 bg-gray-700 text-white rounded-lg mb-4"
              />
            </div>
            <div>
              <label className="block text-white mb-2" htmlFor="description">Description</label>
              <input
                type="text"
                name="description"
                id="description"
                value={editedCategory.description}
                onChange={handleEditChange}
                className="w-full p-2 bg-gray-700 text-white rounded-lg mb-4"
              />
            </div>
            <div>
              <label className="block text-white mb-2" htmlFor="bannerImageKey">Banner Image Key</label>
              <input
                type="text"
                name="bannerImageKey"
                id="bannerImageKey"
                value={editedCategory.bannerImageKey}
                onChange={handleEditChange}
                className="w-full p-2 bg-gray-700 text-white rounded-lg mb-4"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <form onSubmit={handleAddSubmit} className="bg-gray-800 p-6 rounded-lg w-full sm:w-96">
            <h2 className="text-2xl text-white mb-4">Add New Category</h2>
            <div>
              <label className="block text-white mb-2" htmlFor="name">Category Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={newCategory.name}
                onChange={handleAddChange}
                className="w-full p-2 bg-gray-700 text-white rounded-lg mb-4"
              />
            </div>
            <div>
              <label className="block text-white mb-2" htmlFor="description">Description</label>
              <input
                type="text"
                name="description"
                id="description"
                value={newCategory.description}
                onChange={handleAddChange}
                className="w-full p-2 bg-gray-700 text-white rounded-lg mb-4"
              />
            </div>
            <div>
              <label className="block text-white mb-2" htmlFor="bannerImageKey">Banner Image Key</label>
              <input
                type="text"
                name="bannerImageKey"
                id="bannerImageKey"
                value={newCategory.bannerImageKey}
                onChange={handleAddChange}
                className="w-full p-2 bg-gray-700 text-white rounded-lg mb-4"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Add Category
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
export default Category;