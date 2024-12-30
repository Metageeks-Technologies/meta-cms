"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axiosCall from '@/utils/ApiCall';
import { UserProfile } from '@/types';
import { userRoles } from '@/constant/user';

interface UserContextType {
    user: UserProfile;
    subscribers: UserProfile[];
    contributors: UserProfile[];
    moderators: UserProfile[];
    isAuthenticated: boolean;
    isLoading: boolean;
    fetchUsers: (role: string) => Promise<void>;
    changeUserRole: (userId: string, currentRole: string, newRole: string) => Promise<void>;
    getUserProfile: () => Promise<void>;
    setUser: (user: UserProfile) => void;
};

const INITIAL_USER: UserProfile = {
    id: '',
    name: '',
    email: '',
    role: ''
};

// Context Creation
const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<UserProfile>(INITIAL_USER);
    const [subscribers, setSubscribers] = useState<UserProfile[]>([]);
    const [contributors, setContributors] = useState<UserProfile[]>([]);
    const [moderators, setModerators] = useState<UserProfile[]>([]);

    // API Calls
    const fetchUsers = async (role: string) => {
        try {
            toast.loading('Fetching users...');
            const response = await axiosCall(
                'GET',
                `${process.env.NEXT_PUBLIC_BASE_URL}/users/all-${role}`
            );

            if (response?.status === 200 || response?.status === 201) {
                const setterMap = {
                    [userRoles.SUBSCRIBER]: setSubscribers,
                    [userRoles.CONTRIBUTOR]: setContributors,
                    [userRoles.MODERATOR]: setModerators
                };
                setterMap[role](response.data.users);
                toast.dismiss();
            } else {
                throw new Error(response?.data?.message || `Failed to fetch ${role}s`);
            }
        } catch (error) {
            console.error(`Error fetching ${role}s:`, error);
            toast.error(`Failed to fetch ${role}s!`);
        }
    };

    const changeUserRole = async (userId: string, currentRole: string, newRole: string) => {
        try {
            toast.loading('Updating role...');
            const response = await axiosCall('PUT', `${process.env.NEXT_PUBLIC_BASE_URL}/users/change-role`, {
                _id: userId,
                newRole
            });

            if (response.status === 200 || response.status === 201) {
                await fetchUsers(currentRole); // Refresh the list for the current role
                toast.success(response.data.message);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('Error changing user role:', error);
            toast.error('Failed to update user role');
        } finally {
            toast.dismiss();
        }
    };

    const getUserProfile = async () => {
        try {
            setIsLoading(true);
            const response = await axiosCall('GET', `${process.env.NEXT_PUBLIC_BASE_URL}/users/profile`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch user profile');
            }
            
            const userData: UserProfile = response.data;
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setUser(INITIAL_USER);
            setIsAuthenticated(false);
            router.push('/login');
        } finally {
            setIsLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        getUserProfile();
    }, []);

    const contextValue: UserContextType = {
        user,
        subscribers,
        contributors,
        moderators,
        isAuthenticated,
        isLoading,
        fetchUsers,
        changeUserRole,
        getUserProfile,
        setUser
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

// Custom Hook
export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};