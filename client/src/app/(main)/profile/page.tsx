'use client';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axiosCall from '@/utils/ApiCall';
import toast from 'react-hot-toast';
import { SiFacebook } from "react-icons/si";
import { RiInstagramFill } from "react-icons/ri";
import { ImLinkedin } from "react-icons/im";
import { FaSquareXTwitter } from "react-icons/fa6";
import { useUserContext } from '@/context/userContext';
import { MdEdit } from "react-icons/md";
import axios from 'axios';
import { getURL } from '@/utils/AWS_Config';
import ProfileTabs from './components/ProfileTabs';
import { BsTwitterX } from "react-icons/bs";

const ProfilePage: React.FC = () => {
  const { user, getUserProfile, setLoading }: any = useUserContext();


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
  })

  const [isLoading, setIsLoading] = useState(false);


  const fetchAddress = async () => {
    try {
      setIsLoading(true);
      const response = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/address`);

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


  // Update the address using PATCH
  const updateAddress = async () => {
    try {
      setIsLoading(true);
      const addressPayload = { ...userAddress };
      const addressId = '6790c56eaa0bcf6a67947d08'; // Replace with the actual address ID you want to update
      const response = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/address/${addressId}`, addressPayload);

      if (response.status === 200 || response.status === 201) {
        toast.success('Address updated successfully!');
        setAddressEditing(false);
        fetchAddress(); // Re-fetch the updated address
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

  useEffect(() => {
    fetchAddress();
  }, []);


  const [isEditing, setIsEditing] = useState(false);
  const [addressEditing, setAddressEditing] = useState(false);

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
    })
  }

  const handleCancel = () => {
    fetchUser();
    setIsEditing(false);
  };


  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = { ...userProfile };
      const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/users/profile`, payload);

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
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  const handleUploadProfile = async (fileList: FileList | null) => {
    if (!isEditing) return;

    try {
      setLoading(true);
      // console.log(fileList?.[0]);
      const payload = {
        folderName: process.env.NEXT_PUBLIC_AWS_FOLDER_POSTS,
        fileName: fileList?.[0].name,
        contentType: fileList?.[0].type
      }
      const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/media/signed-upload-url`, payload);
      if (resp.status === 200 || resp.status === 201) {
        // uploadToS3(resp?.data?.uploadUrl, fileList?.[0], resp?.data?.key, setLoading, process.env.NEXT_PUBLIC_AWS_FOLDER_USER, setUserProfile);
        const response = await axios.put(resp?.data?.uploadUrl, fileList?.[0]);

        if (response.status === 200 || response.status === 201) {
          setUserProfile({ ...userProfile, imageKey: resp?.data?.key })
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

  }

  useEffect(() => {
    fetchUser();
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-white  px-6 sm:px-8 md:px-12 lg:px-16 pb-20">
      <div className="mx-auto rounded-lg bg-black shadow-lg p-6 sm:p-8 md:p-10">

        <div className="flex items-center justify-between space-x-4 mb-6">
          <div className="flex flex-row items-center gap-5">

            {
              isEditing ?
                <label>
                  <div className='relative'>
                    <Avatar className='w-20 h-20'>
                      <AvatarImage src={userProfile?.imageKey ? getURL(userProfile?.imageKey) : "https://github.com/shadcn.png"} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='bg-white text-black text-xl rounded-full max-w-min p-1 absolute right-0 bottom-0 cursor-pointer'>
                      <MdEdit />
                    </div>
                  </div>

                  <input type="file" className='hidden' onChange={(e) => handleUploadProfile(e.target.files)} />
                </label>
                :
                <Avatar className='w-20 h-20'>
                  <AvatarImage src={user?.imageKey ? getURL(user?.imageKey) : "https://github.com/shadcn.png"} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            }

            <h1 className="text-xl sm:text-2xl font-bold text-white">My Profile</h1>
          </div>

          <div className='flex flex-row items-center gap-3'>
            {
              userProfile?.socialLinks.facebook &&
              <a href={userProfile?.socialLinks.facebook} target='_blank'>
                <SiFacebook className='text-2xl text-blue-500' />
              </a>
            }
            {
              userProfile?.socialLinks.instagram &&
              <a href={userProfile?.socialLinks.instagram} target='_blank'>
                <RiInstagramFill className='text-3xl text-red-500' />
              </a>
            }
            {
              userProfile?.socialLinks.linkedIn &&
              <a href={userProfile?.socialLinks.linkedIn} target='_blank'>
                <ImLinkedin className='text-2xl text-blue-500' />
              </a>
            }
            {
              userProfile?.socialLinks.twitter &&
              <a href={userProfile?.socialLinks.twitter} target='_blank'>
                <BsTwitterX className='text-2xl text-white' />
              </a>
            }
          </div>

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">


          {/* full name  */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="firstName">Full Name</label>
            <input
              type="text"
              placeholder='Enter full name...'
              name="fullname"
              id="fullname"
              required
              value={userProfile?.name}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Use a regular expression to allow only letters and spaces
                if (/^[a-zA-Z\s]*$/.test(inputValue)) {
                  setUserProfile({ ...userProfile, name: inputValue });
                }
              }}
              disabled={!isEditing}
              className={`w-full px-4 py-2 bg-gray-700 rounded-md focus:ring ${isEditing ? 'ring-yellow-500' : 'opacity-50 cursor-not-allowed'}`}
            />
          </div>


          {/* phone  */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="firstName">Phone</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              maxLength={10}
              placeholder='Enter  phone number...'
              value={userProfile?.phoneNo}
              onChange={(e) => {
                // Ensure that only digits are allowed (no characters, no special symbols)
                const numericValue = e.target.value.replace(/[^0-9]/g, '');
                setUserProfile({ ...userProfile, phoneNo: numericValue });
              }} disabled={!isEditing}
              className={`w-full px-4 py-2 bg-gray-700 rounded-md focus:ring ${isEditing ? 'ring-yellow-500' : 'opacity-50 cursor-not-allowed'}`}

            />
          </div>


          {/* bio */}
          {!isEditing && userProfile?.bio && (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="bio">Bio</label>
              <textarea
                disabled={!isEditing}
                className={`w-full px-4 py-2 bg-gray-700 rounded-md focus:ring ${isEditing ? 'ring-yellow-500' : 'opacity-50 cursor-not-allowed'}`} rows={3}
                value={userProfile.bio}
                readOnly
              />
            </div>

          )}

          {isEditing && (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="bio">Bio</label>
              <textarea
                name="bio"
                id="bio"
                value={userProfile?.bio}
                onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                placeholder='Tell us about yourself...'
                className="w-full px-4 py-2 bg-gray-700 rounded-md focus:ring ring-yellow-500"
                rows={3}
              />
            </div>
          )}




          {/* email  */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={userProfile?.email}
              disabled

              className={`w-full px-4 py-2 bg-gray-700 rounded-md focus:ring ${isEditing ? 'ring-yellow-500' : 'opacity-50 cursor-not-allowed'}`}

            />
          </div>


          <div className='flex flex-row gap-5'>

            {/* role  */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="role">Role</label>
              <input
                type="text"
                name="role"
                id="role"
                value={userProfile?.role.replace(/^\w/, (c) => c.toUpperCase())}
                disabled
                className={`w-full px-4 py-2 bg-gray-700 rounded-md focus:ring ${isEditing ? 'ring-yellow-500' : 'opacity-50 cursor-not-allowed'}`}
              />
            </div>

            {/* STORE ROLE  */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="storeRole">Store role</label>
              <input
                type="text"
                name="storeRole"
                id="storeRole"
                value={userProfile?.storeRole?.replace(/^\w/, (c) => c.toUpperCase())}
                disabled
                className={`w-full px-4 py-2 bg-gray-700 rounded-md focus:ring ${isEditing ? 'ring-yellow-500' : 'opacity-50 cursor-not-allowed'}`}
              />
            </div>

          </div>

          {
            isEditing &&
            <div className='col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6'>


              {/* facebook */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="facebook">Facebook</label>
                <input
                  type="url"
                  name="role"
                  id="facebook"
                  placeholder='Add link here...'
                  value={userProfile?.socialLinks?.facebook}
                  onChange={(e) => {
                    setUserProfile({
                      ...userProfile,
                      socialLinks: {
                        ...userProfile.socialLinks,
                        facebook: e.target.value
                      }
                    })
                  }}
                  className={`w-full px-4 py-2 bg-gray-700 rounded-md focus:ring ${isEditing ? 'ring-yellow-500' : 'opacity-50 cursor-not-allowed'}`}
                />
              </div>

              {/* instagram  */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="instagram">Instagram</label>
                <input
                  type="url"
                  name="role"
                  id="instagram"
                  placeholder='Add link here...'
                  value={userProfile?.socialLinks?.instagram}
                  onChange={(e) => {
                    setUserProfile({
                      ...userProfile,
                      socialLinks: {
                        ...userProfile.socialLinks,
                        instagram: e.target.value
                      }
                    })
                  }}
                  className={`w-full px-4 py-2 bg-gray-700 rounded-md focus:ring ${isEditing ? 'ring-yellow-500' : 'opacity-50 cursor-not-allowed'}`}
                />
              </div>

              {/* linkedIn */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="linkedin">Linked In</label>
                <input
                  type="url"
                  name="role"
                  id="linkedin"
                  placeholder='Add link here...'
                  value={userProfile?.socialLinks?.linkedIn}
                  onChange={(e) => {
                    setUserProfile({
                      ...userProfile,
                      socialLinks: {
                        ...userProfile.socialLinks,
                        linkedIn: e.target.value
                      }
                    })
                  }}
                  className={`w-full px-4 py-2 bg-gray-700 rounded-md focus:ring ${isEditing ? 'ring-yellow-500' : 'opacity-50 cursor-not-allowed'}`}
                />
              </div>

              {/* twitter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="x">X</label>
                <input
                  type="url"
                  name="role"
                  id="x"
                  placeholder='Add  link here...'
                  value={userProfile?.socialLinks?.twitter}
                  onChange={(e) => {
                    setUserProfile({
                      ...userProfile,
                      socialLinks: {
                        ...userProfile.socialLinks,
                        twitter: e.target.value
                      }
                    })
                  }}
                  className={`w-full px-4 py-2 bg-gray-700 rounded-md focus:ring ${isEditing ? 'ring-yellow-500' : 'opacity-50 cursor-not-allowed'}`}
                />
              </div>

            </div>
          }


        </div>


        {/* action buttons  */}
        <div className="flex items-center justify-end space-x-4 mt-6">
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
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm sm:text-base"
            >
              <FaEdit className="inline mr-2" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <ProfileTabs />
    </div>
  );
};

export default ProfilePage;
