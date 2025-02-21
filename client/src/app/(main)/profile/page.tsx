'use client';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axiosCall from '@/utils/ApiCall';
import toast from 'react-hot-toast';
import { SiFacebook } from "react-icons/si";
import { RiInstagramFill } from "react-icons/ri";
import { ImLinkedin } from "react-icons/im";
import { useUserContext } from '@/context/userContext';
import { MdEdit } from "react-icons/md";
import axios from 'axios';
import { getURL } from '@/utils/AWS_Config';
import ProfileTabs from './components/ProfileTabs';
import { BsTwitterX } from "react-icons/bs";
import { User, Phone, Mail, Briefcase } from 'lucide-react';
import { IoIosContact } from "react-icons/io";

const ProfilePage: React.FC = () => {
  const { user, getUserProfile, setLoading, websiteKey}: any = useUserContext();

  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    imageKey: "",
    role: "",
    storeRole: "",
    phoneNo: "",      
    bio: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      linkedIn: "",
      twitter: "",
    }
  });

  const [userAddress, setUserAddress] = useState({
    house: "",
    street: "",
    landmark: "",
    postalCode: "",
    city: "",
    state: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [addressEditing, setAddressEditing] = useState(false);

  const fetchAddress = async () => {
    try {
      setIsLoading(true);
      const response = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/address`,undefined,{websiteKey});
      
      if (response.data && response.data.length > 0) {
        const address = response.data[0]; // Assuming you need the first address
        setUserAddress({
          house: address.house,
          street: address.street,
          landmark: address.landmark,
          postalCode: address.postalCode,
          city: address.city,
          state: address.state,
        });
      }
    } catch (error) {
      toast.error('Error fetching address');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAddress = async () => {
    try {
      setIsLoading(true);
      const addressPayload = { ...userAddress };
      const addressId = '6790c56eaa0bcf6a67947d08'; 
      const response = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/address/${addressId}`, addressPayload,{websiteKey});

      if (response.status === 200 || response.status === 201) {
        toast.success('Address updated successfully!');
        setAddressEditing(false);
        fetchAddress();
      } else {
        toast.error('Failed to update address');
      }
    } catch (error) {
      toast.error('Error updating address');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUser = () => {
    setUserProfile({
      name: user?.name,
      email: user?.email,
      imageKey: user?.imageKey,
      role: user?.role,
      storeRole: user?.storeRole,
      phoneNo: user?.phoneNo ? user?.phoneNo : "",
      bio: user?.bio ? user?.bio : "",
      socialLinks: {
        facebook: user?.socialLinks?.facebook ? user?.socialLinks?.facebook : "",
        instagram: user?.socialLinks?.instagram ? user?.socialLinks?.instagram : "",
        linkedIn: user?.socialLinks?.linkedIn ? user?.socialLinks?.linkedIn : "",
        twitter: user?.socialLinks?.twitter ? user?.socialLinks?.twitter : "",
      }
    });
  };

  const handleCancel = () => {
    fetchUser();
    setIsEditing(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = { ...userProfile };
      const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/users/profile`, payload, {  websiteKey });

      if (resp.status === 200 || resp.status === 201) {
        toast.success(resp.data.message, {
          duration: 2000,
        });
        setIsEditing(false);
        getUserProfile();
      } else {
        toast.error(resp.data.message, {
          duration: 2000,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadProfile = async (fileList: FileList | null) => {
    if (!isEditing) return;

    try {
      setLoading(true);
      const payload = {
        folderName: process.env.NEXT_PUBLIC_AWS_FOLDER_POSTS,
        fileName: fileList?.[0].name,
        contentType: fileList?.[0].type
      };
      const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/media/signed-upload-url`, payload,{ websiteKey });
      if (resp.status === 200 || resp.status === 201) {
        const response = await axios.put(resp?.data?.uploadUrl, fileList?.[0]);

        if (response.status === 200 || response.status === 201) {
          setUserProfile({ ...userProfile, imageKey: resp?.data?.key });
        }
      } else {
        toast.error(resp.data.message, {
          duration: 2000
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  useEffect(() => {
    fetchUser();
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-white px-6 sm:px-8 md:px-12 lg:px-16 pb-20">
      <div className="max-w-7xl mx-auto pt-10">
        {/* Profile Card */}
        <div className="rounded-xl bg-gray-800/50 border border-gray-700 shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="px-8 py-6">
            <div className="flex flex-col md:flex-row items-start">
              <div className="relative">
                {isEditing ? (
                  <label>
                    <div className="relative">
                      <Avatar className="w-24 h-24 border-2 border-gray-700 shadow-lg">
                        <AvatarImage 
                          src={userProfile?.imageKey ? getURL(userProfile?.imageKey) : "https://github.com/shadcn.png"}
                          alt="Profile"
                        />
                        <AvatarFallback>
                          {userProfile?.name?.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-yellow-500 text-black text-xl rounded-full p-1 absolute -right-1 -bottom-1 cursor-pointer shadow-lg hover:bg-yellow-400 transition-colors">
                        <MdEdit />
                      </div>
                    </div>
                    <input type="file" className="hidden" onChange={(e) => handleUploadProfile(e.target.files)} />
                  </label>
                ) : (
                  <Avatar className="w-24 h-24 border-2 border-gray-700 shadow-lg">
                    <AvatarImage 
                      src={user?.imageKey ? getURL(user?.imageKey) : "https://github.com/shadcn.png"}
                      alt="Profile"
                    />
                    <AvatarFallback>
                      
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
              
              <div className="mt-4 md:mt-0 md:ml-6">
                <h1 className="text-2xl font-bold text-white">
                  {userProfile?.name}
                </h1>
                <p className="text-yellow-400">
                  {userProfile?.role?.replace(/^\w/, (c) => c.toUpperCase())}
                </p>
              </div>
              
              {/* Social Media Links */}
              <div className="flex items-center gap-4 mt-4 md:mt-0 md:ml-auto">
                {userProfile?.socialLinks?.facebook && (
                  <a href={userProfile?.socialLinks.facebook} target="_blank" className="hover:opacity-80 transition-opacity bg-gray-700 p-2 rounded-full">
                    <SiFacebook className="text-2xl text-blue-500" />
                  </a>
                )}
                {userProfile?.socialLinks?.instagram && (
                  <a href={userProfile?.socialLinks.instagram} target="_blank" className="hover:opacity-80 transition-opacity bg-gray-700 p-2 rounded-full">
                    <RiInstagramFill className="text-2xl text-red-500" />
                  </a>
                )}
                {userProfile?.socialLinks?.linkedIn && (
                  <a href={userProfile?.socialLinks.linkedIn} target="_blank" className="hover:opacity-80 transition-opacity bg-gray-700 p-2 rounded-full">
                    <ImLinkedin className="text-2xl text-blue-500" />
                  </a>
                )}
                {userProfile?.socialLinks?.twitter && (
                  <a href={userProfile?.socialLinks.twitter} target="_blank" className="hover:opacity-80 transition-opacity bg-gray-700 p-2 rounded-full">
                    <BsTwitterX className="text-2xl text-white" />
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* Divider */}
          <div className="h-px bg-gray-700 mx-8"></div>
          
          {/* Profile Content */}
          <div className="p-8">
            <div className="space-y-8 overflow-y-auto max-h-[60vh] styledScrollable pr-4">
              {/* Bio Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2 mb-4">
                  <User className="w-5 h-5" />
                  About Me
                </h2>
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-700">
                  <textarea
                    name="bio"
                    id="bio"
                    rows={4}
                    value={userProfile?.bio}
                    onChange={(e) => isEditing && setUserProfile({ ...userProfile, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 
                      ${isEditing ? 'focus:ring-yellow-500 hover:border-gray-500' : 'opacity-50 cursor-not-allowed'}`}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2 mb-4">
                <IoIosContact className="w-5 h-5 mr-2 text-gray-400" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="fullname">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter full name..."
                        name="fullname"
                        id="fullname"
                        required
                        value={userProfile?.name}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (/^[a-zA-Z\s]*$/.test(inputValue)) {
                            setUserProfile({ ...userProfile, name: inputValue });
                          }
                        }}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 
                          ${isEditing ? 'focus:ring-yellow-500 hover:border-gray-500' : 'opacity-50 cursor-not-allowed'}`}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="phone">
                      <span className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        Phone Number
                      </span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      maxLength={10}
                      placeholder="Enter phone number..."
                      value={userProfile?.phoneNo}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/[^0-9]/g, '');
                        setUserProfile({ ...userProfile, phoneNo: numericValue });
                      }}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 
                        ${isEditing ? 'focus:ring-yellow-500 hover:border-gray-500' : 'opacity-50 cursor-not-allowed'}`}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <span className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </span>
                    </label>
                    <input
                      type="email"
                      value={userProfile?.email}
                      disabled
                      className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 opacity-50 cursor-not-allowed"
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <span className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Role
                      </span>
                    </label>
                    <input
                      type="text"
                      value={userProfile?.role?.replace(/^\w/, (c) => c.toUpperCase())}
                      disabled
                      className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 opacity-50 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Social Links Section */}
              {isEditing && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-200 mb-4">Social Links</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-700/30 p-4 rounded-lg">
                    {/* Facebook */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="facebook">
                        <span className="flex items-center">
                          <SiFacebook className="w-4 h-4 mr-2 text-blue-500" />
                          Facebook
                        </span>
                      </label>
                      <input
                        type="url"
                        id="facebook"
                        placeholder="Add Facebook link..."
                        value={userProfile?.socialLinks?.facebook || ""}
                        onChange={(e) => {
                          setUserProfile({
                            ...userProfile,
                            socialLinks: {
                              ...userProfile.socialLinks,
                              facebook: e.target.value
                            }
                          })
                        }}
                        className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>

                    {/* Instagram */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="instagram">
                        <span className="flex items-center">
                          <RiInstagramFill className="w-4 h-4 mr-2 text-pink-500" />
                          Instagram
                        </span>
                      </label>
                      <input
                        type="url"
                        id="instagram"
                        placeholder="Add Instagram link..."
                        value={userProfile?.socialLinks?.instagram || ""}
                        onChange={(e) => {
                          setUserProfile({
                            ...userProfile,
                            socialLinks: {
                              ...userProfile.socialLinks,
                              instagram: e.target.value
                            }
                          })
                        }}
                        className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="linkedin">
                        <span className="flex items-center">
                          <ImLinkedin className="w-4 h-4 mr-2 text-blue-500" />
                          LinkedIn
                        </span>
                      </label>
                      <input
                        type="url"
                        id="linkedin"
                        placeholder="Add LinkedIn link..."
                        value={userProfile?.socialLinks?.linkedIn || ""}
                        onChange={(e) => {
                          setUserProfile({
                            ...userProfile,
                            socialLinks: {
                              ...userProfile.socialLinks,
                              linkedIn: e.target.value
                            }
                          })
                        }}
                        className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>

                    {/* Twitter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="x">
                        <span className="flex items-center">
                          <BsTwitterX className="w-4 h-4 mr-2" />
                          X (Twitter)
                        </span>
                      </label>
                      <input
                        type="url"
                        id="x"
                        placeholder="Add X (Twitter) link..."
                        value={userProfile?.socialLinks?.twitter || ""}
                        onChange={(e) => {
                          setUserProfile({
                            ...userProfile,
                            socialLinks: {
                              ...userProfile.socialLinks,
                              twitter: e.target.value
                            }
                          })
                        }}
                        className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 mt-6 border-t border-gray-700">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm sm:text-base flex items-center gap-2 transition-colors"
                  >
                    <FaCheck className="text-sm" /> Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm sm:text-base flex items-center gap-2 transition-colors"
                  >
                    <FaTimes className="text-sm" /> Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg text-sm sm:text-base flex items-center gap-2 transition-colors"
                >
                  <FaEdit className="text-sm" /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Tabs Section */}
        <div className="mt-8">
          <ProfileTabs />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;