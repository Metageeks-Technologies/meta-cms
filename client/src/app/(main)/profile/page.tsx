'use client';

import React, { useState } from 'react';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { AiOutlineUser } from 'react-icons/ai';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { useAuth } from '@/hooks/useAuth';
import { PostTypes, UserProfile } from '@/types';
import { blogPosts } from '@/constant/post';




const ProfilePage: React.FC = () => {
  useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: 'Mehrab',
    lastName: 'Bozorgi',
    email: 'mehrabbozorgi.business@gmail.com',
    role: 'Admin',
    bio: 'A passionate developer and admin.',
    password: '********',
    confirmPassword: '********',
  });

  const [editData, setEditData] = useState(profileData);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };


  const handleSave = () => {
    if (editData.password === editData.confirmPassword) {
      setProfileData(editData);
      setIsEditing(false);
    } else {
      alert("Passwords do not match!");
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  // For User Posts and Comments Logic
  const [activeTab, setActiveTab] = useState<'userPosts' | 'userComments'>('userPosts');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // const userPostsData = blogPosts.filter((post: PostTypes) => post.authorId === userProfile.name);

  // const filteredPosts = userPostsData.filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const getShortDescription = (description: string) => {
    const words = description.split(' ');
    return words.slice(0, 10).join(' ') + (words.length > 10 ? '...' : '');
  };



  return (
    <div className="min-h-screen bg-black text-white  px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="mx-auto rounded-lg bg-black shadow-lg p-6 sm:p-8 md:p-10">
        {/* Header for Profile */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-700 rounded-full overflow-hidden flex items-center justify-center">
            <AiOutlineUser className="text-3xl text-gray-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">My Profile</h1>
        </div>

        {/* Form for Profile Editing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="firstName">First Name</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={editData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 bg-gray-700 rounded-md focus:ring ${isEditing ? 'ring-yellow-500' : 'opacity-50 cursor-not-allowed'}`}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="lastName">Last Name</label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={editData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 bg-gray-700 rounded-md focus:ring ${isEditing ? 'ring-yellow-500' : 'opacity-50 cursor-not-allowed'}`}
              />
            </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="bio">Bio</label>
            {isEditing ? (
              <textarea
                name="bio"
                id="bio"
                value={editData.bio}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 rounded-md focus:ring ring-yellow-500"
                rows={3}
              />
            ) : (
              <p className="text-gray-300">{profileData.bio}</p>
            )}
          </div>

          {/* Email and Role */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={editData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 bg-gray-700 rounded-md focus:ring ${isEditing ? 'ring-yellow-500' : 'opacity-50 cursor-not-allowed'}`}

            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="role">Role</label>
            <input
              type="text"
              name="role"
              id="role"
              value={editData.role}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 bg-gray-700 rounded-md focus:ring ${isEditing ? 'ring-yellow-500' : 'opacity-50 cursor-not-allowed'}`}
            />
          </div>

          {/* Password fields only visible when editing */}
          {isEditing && (
            <>
              <div className="sm:col-span-2 relative">
                <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">Password</label>
                <div className="flex items-center bg-gray-700 rounded-md">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    name="password"
                    id="password"
                    value={editData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-transparent focus:ring ${isEditing ? 'ring-yellow-500' : 'opacity-50 cursor-not-allowed'}`}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 px-3"
                  >
                    {passwordVisible ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2 relative">
                <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="confirmPassword">Confirm Password</label>
                <div className="flex items-center bg-gray-700 rounded-md">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    name="confirmPassword"
                    id="confirmPassword"
                    value={editData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-transparent focus:ring ${isEditing ? 'ring-yellow-500' : 'opacity-50 cursor-not-allowed'}`}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions to Save or Cancel */}
        <div className="flex items-center justify-center space-x-4 mt-6">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm sm:text-base"
              >
                <FaCheck className="inline mr-2" /> Save
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm sm:text-base"
              >
                <FaTimes className="inline mr-2" /> Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm sm:text-base"
            >
              <FaEdit className="inline mr-2" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Tab navigation for Posts and Comments */}
      <div className="flex space-x-4 mb-2">
        <div
          className={`cursor-pointer px-4 py-2 text-center text-lg font-semibold transition-all duration-300 ease-in-out ${activeTab === 'userPosts' ? 'text-blue-500 border-b-4 border-blue-500' : 'text-white hover:text-gray-400'}`}
          onClick={() => setActiveTab('userPosts')}
        >
          User Posts
        </div>
        <div
          className={`cursor-pointer px-4 py-2 text-center text-lg font-semibold transition-all duration-300 ease-in-out ${activeTab === 'userComments' ? 'text-blue-500 border-b-4 border-blue-500' : 'text-white hover:text-gray-400'}`}
          onClick={() => setActiveTab('userComments')}
        >
          User Comments
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search posts/comments"
          className="w-full sm:w-1/2 lg:w-1/3 p-2 rounded-md bg-gray-700 text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Display Posts or Comments based on active tab */}
      {activeTab === 'userPosts' ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          {/* <TableBody>
            {filteredPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(post => (
              <TableRow key={post.id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>{post.tag}</TableCell>
                <TableCell>{post.status}</TableCell>
                <TableCell>
                  <button className="text-blue-500">View</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody> */}
        </Table>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Post Title</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          {/* <TableBody>
            {filteredComments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(comment => (
              <TableRow key={comment.id}>
                <TableCell>{postsData.find(post => post.id === comment.postId)?.title}</TableCell>
                <TableCell>{getShortDescription(comment.content)}</TableCell>
                <TableCell>{comment.date}</TableCell>
              </TableRow>
            ))}
          </TableBody> */}
        </Table>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          // onClick={}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700 text-white rounded-md"
        >
          Prev
        </button>
        <button
          // onClick={}
          // disabled={(activeTab === 'userPosts' ? currentPage === totalPostPages : currentPage === totalCommentPages)}
          className="px-4 py-2 bg-gray-700 text-white rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
