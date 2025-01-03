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
    loading: boolean;
    setLoading : (loading: boolean) => void;
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

    const [loading, setLoading] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<UserProfile>(INITIAL_USER);
    const [subscribers, setSubscribers] = useState([]);
    const [contributors, setContributors] = useState([]);
    const [moderators, setModerators] = useState([]);


    // API Calls
    const fetchUsers = async (role: string) => {
        // console.log(role,"User role");
        setIsLoading(true);
        try {
            const response = await axiosCall(
                'GET',
                `${process.env.NEXT_PUBLIC_BASE_URL}/users/all-${role}`
            );

            // console.log(response, "userfetch res")

            if (response?.status === 200 || response?.status === 201) {
                if(role === userRoles.SUBSCRIBER){
                    setSubscribers(response?.data?.users);
                }
                if(role === userRoles.CONTRIBUTOR){
                    setContributors(response?.data?.users);
                }
                if(role === userRoles.MODERATOR){
                    setModerators(response?.data?.users);
                }
            } else {
                throw new Error(response?.data?.message || `Failed to fetch ${role}s`);
            }
        } catch (error) {
            console.error(`Error fetching ${role}s:`, error);
            toast.error(`Failed to fetch ${role}s!`);
        }finally{
            setIsLoading(false);
        }
    };

    const changeUserRole = async (userId: string, currentRole: string, newRole: string) => {
        setLoading(true);
        try {
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
            setLoading(false);
        }
    };

    const getUserProfile = async () => {
        setLoading(true);
        try {
            const response = await axiosCall('GET', `${process.env.NEXT_PUBLIC_BASE_URL}/users/profile`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch user profile');
            }
            
            const userData: UserProfile = response.data;
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.log('Error fetching user profile:', error);
            setUser(INITIAL_USER);
            setIsAuthenticated(false);
            router.push('/');
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        getUserProfile();
    }, []);

    useEffect(() => {
        if(loading){
            document.body.style.overflow = 'hidden';
        }else{
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        }
    },[loading]);

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
        setUser,
        loading,
        setLoading,
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