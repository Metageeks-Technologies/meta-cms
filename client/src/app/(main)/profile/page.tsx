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

const ProfilePage: React.FC = () => {
  const { user, getUserProfile, setLoading }: any = useUserContext();

  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    role: "",
    phoneNo: "",
    bio: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      linkedIn: "",
      twitter: "",
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  const fetchUser = () => {
      setUserProfile({
        name: user?.name,
        email: user?.email,
        role: user?.role,
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

  useEffect(() => {
      fetchUser();
  }, [user]);



  return (
    <div className="min-h-screen bg-black text-white  px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="mx-auto rounded-lg bg-black shadow-lg p-6 sm:p-8 md:p-10">

        <div className="flex items-center justify-between space-x-4 mb-6">
          <div className="flex flex-row items-center gap-5">
            <Avatar className='w-20 h-20'>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
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
                <FaSquareXTwitter className='text-3xl text-gray-800' />
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
              name="fullname"
              id="fullname"
              value={userProfile?.name}
              onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
              disabled={!isEditing}
              className={`w-full px-4 py-2 bg-gray-700 rounded-md focus:ring ${isEditing ? 'ring-yellow-500' : 'opacity-50 cursor-not-allowed'}`}
            />
          </div>

          {/* phone  */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="firstName">Phone</label>
            <input
              type="text"
              name="phone"
              id="phone"
              value={userProfile?.phoneNo}
              onChange={(e) => setUserProfile({ ...userProfile, phoneNo: e.target.value })}
              disabled={!isEditing}
              className={`w-full px-4 py-2 bg-gray-700 rounded-md focus:ring ${isEditing ? 'ring-yellow-500' : 'opacity-50 cursor-not-allowed'}`}
            />
          </div>

          {/* bio  */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="bio">Bio</label>
            {isEditing ? (
              <textarea
                name="bio"
                id="bio"
                value={userProfile?.bio}
                onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-md focus:ring ring-yellow-500"
                rows={3}
              />
            ) : (
              <p className="text-gray-300">{userProfile?.bio}</p>
            )}
          </div>

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

          {/* role  */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="role">Role</label>
            <input
              type="text"
              name="role"
              id="role"
              value={userProfile?.role}
              disabled
              className={`w-full px-4 py-2 bg-gray-700 rounded-md focus:ring ${isEditing ? 'ring-yellow-500' : 'opacity-50 cursor-not-allowed'}`}
            />
          </div>

          {
            isEditing &&
            <div className='col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6'>

              {/* facebook */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="role">Facebook</label>
                <input
                  type="text"
                  name="role"
                  id="role"
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
                <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="role">Instagram</label>
                <input
                  type="text"
                  name="role"
                  id="role"
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
                <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="role">Linked In</label>
                <input
                  type="text"
                  name="role"
                  id="role"
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
                <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="role">Twitter</label>
                <input
                  type="text"
                  name="role"
                  id="role"
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
    </div>
  );
};

export default ProfilePage;
