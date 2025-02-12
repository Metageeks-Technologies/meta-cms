"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axiosCall from '@/utils/ApiCall';
import { UserProfile } from '@/types';
import { INITIAL_USER, userRoles } from '@/constant/user';
import { StoreRole } from '@/constant/store';
interface UserContextType {
    user: UserProfile;
    subscribers: UserProfile[];
    contributors: UserProfile[];
    moderators: UserProfile[];
    
    adminData: UserProfile[];

    storeUser: UserProfile[];
    vendor: UserProfile[];
    storeModerator: UserProfile[];

    isAuthenticated: boolean;
    isLoading: boolean;
    fetchUsers: (role: string) => Promise<void>;
    fetchAdmins: () => Promise<void>;
    fetchStoreRole: (storeRole: string) => Promise<void>;
    changeUserRole: (userId: string, currentRole: string, newRole: string) => Promise<void>;
    changeStoreRole: (userId: string, currentRole: string, newRole: string) => Promise<void>;
    getUserProfile: () => Promise<void>;
    setUser: (user: UserProfile) => void;
    blockUser: (userId: string,role:string) => Promise<void>;
    unblockUser: (userId: string,role:string) => Promise<void>;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    website: any;
    websiteKey: string;
    setWebsiteKey: (key: string) => void;
    websiteData: any[];
    setWebsiteData: (data: any[]) => void;
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

    const [storeUser, setStoreUser] = useState([]);
    const [vendor, setVendor] = useState([]);
    const [storeModerator, setStoreModerator] = useState([]);
    const [websiteKey, setWebsiteKey] = useState<any>('');
    const [website, setWebsite] = useState<any>();
    const [websiteData, setWebsiteData] = useState<any[]>([]);


    const [adminData, setAdminData] = useState<any[]>([]); 

    // console.log(contributors, "Contributors")


    // console.log(websiteData, "webiste data")


    // API Calls
    const fetchUsers = async (role: string) => {
        setLoading(true);
        setIsLoading(true);

        try {
            const response = await axiosCall('GET', `${process.env.NEXT_PUBLIC_BASE_URL}/users/all-user/${role}`, undefined, {websiteKey: websiteKey});

            if (response?.status === 200 || response?.status === 201) {
                if (role === userRoles.SUBSCRIBER) {
                    setSubscribers(response?.data);
                }
                if (role === userRoles.CONTRIBUTOR) {
                    setContributors(response?.data);
                }
                if (role === userRoles.MODERATOR) {
                    setModerators(response?.data);
                }
            } else {
                throw new Error(response?.data?.message || `Failed to fetch ${role}s`);
            }
        } catch (error) {
            console.error(`Error fetching ${role}s:`, error);
            toast.error(`Failed to fetch ${role}s!`);
        } finally {
            setIsLoading(false);
            setLoading(false);
        }
    };


    const fetchAdmins = async () => {
        setLoading(true);
        try {
          const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/users/all-admin`)
          // console.log(resp.data)
    
          if (resp?.status === 200 || resp?.status === 201) {
            setAdminData(resp?.data);
          } else {
            toast.error(resp?.data?.message, {
              duration: 2000,
            });
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };


    const fetchStoreRole = async (storeRole: string) => {
        setLoading(true);
        setIsLoading(true);
        try {
            const response = await axiosCall('GET', `${process.env.NEXT_PUBLIC_BASE_URL}/users/all-store-${storeRole}`);


            if (response?.status === 200 || response?.status === 201) {
                // Dynamically update the state based on storeRole
                if (storeRole === StoreRole.USER) {
                    setStoreUser(response?.data?.users);
                }

                if (storeRole === StoreRole.VENDOR) {
                    setVendor(response?.data?.vendors);
                }
                if (storeRole === StoreRole.STOREMODERATOR) {
                    setStoreModerator(response?.data?.users);
                }
            } else {
                throw new Error(response?.data?.message || `Failed to fetch ${storeRole}s`);
            }
        } catch (error) {
            console.error(`Error fetching ${storeRole}s:`, error);
            toast.error(`Failed to fetch ${storeRole}s!`);
        } finally {
            setIsLoading(false);
            setLoading(false);
        }
    };


    const changeUserRole = async (userId: string, currentRole: string, newRole: string) => {
        setLoading(true);
        try {
            const response = await axiosCall('PUT', `${process.env.NEXT_PUBLIC_BASE_URL}/users/change-role`, {
                _id: userId,
                newRole
            },{websiteKey: websiteKey});

            // console.log(response.data);

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

    const changeStoreRole = async (userId: string, currentRole: string, newRole: string) => {
        setLoading(true);
        try {
            const response = await axiosCall('PUT', `${process.env.NEXT_PUBLIC_BASE_URL}/users/change-store-role`, {
                _id: userId,
                newRole
            });

            if (response.status === 200 || response.status === 201) {
                await fetchStoreRole(currentRole);
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
    }

    const fetchWebsiteData = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/website`)

            if (resp.status === 200 || resp.status === 201) {
                setWebsiteData(resp?.data);
                setWebsiteKey(resp?.data[0].key)
            } else {
                toast.error(resp?.data?.message, { duration: 2000 })
            }

        } catch (error) {
            console.log("Error in fetching websites : ", error);
        } finally {
            setLoading(false)
        }
    }

    const fetchWebsite = async (key: string) => {
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/website/any/${key}`)

            if (resp.status === 200 || resp.status === 201) {
                setWebsite(resp?.data);
            } else {
                // toast.error(resp?.data?.message, { duration: 2000 })
            }
        } catch (error) {
            console.log("Error in fetching website : ", error);
        } finally {
            setLoading(false);
        }
    }

    const getUserProfile = async () => {
        setLoading(true);
        try {
            const response = await axiosCall('GET', `${process.env.NEXT_PUBLIC_BASE_URL}/users/profile`);
            if (response.status !== 200) {
                if (response.status !== 401) {
                    throw new Error('Failed to fetch user profile');
                }
                router.push('/');
            }

            const userData: UserProfile = response.data;
            setUser(userData);
            setWebsiteKey(userData?.website?.key);

            if (userData.role === userRoles.SUPERADMIN) {
                fetchWebsiteData();
            }

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

    const blockUser = async (userId: string,role:string) => {
        setLoading(true);
        try {
            const response = await axiosCall('PATCH', `${process.env.NEXT_PUBLIC_BASE_URL}/users/block/${userId}` ,undefined, {websiteKey: websiteKey});

            if (response.status === 200) {
                toast.success(response.data.message);
                if(role===userRoles.ADMIN) await fetchAdmins();
                if(role === userRoles.CONTRIBUTOR) await fetchUsers(userRoles.CONTRIBUTOR);
                if(role === userRoles.MODERATOR) await fetchUsers(userRoles.MODERATOR);
                if(role === userRoles.SUBSCRIBER) await fetchUsers(userRoles.SUBSCRIBER);
                if(role === StoreRole.USER) await fetchStoreRole(StoreRole.USER);
                if(role === StoreRole.VENDOR) await fetchStoreRole(StoreRole.VENDOR);
                if(role === StoreRole.STOREMODERATOR) await fetchStoreRole(StoreRole.STOREMODERATOR);
                // Refresh the 
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            toast.error('Failed to block user');
        } finally {
            setLoading(false);
        }
    };

    const unblockUser = async (userId: string,role:string) => {
        setLoading(true);
        try {
            const response = await axiosCall('PATCH', `${process.env.NEXT_PUBLIC_BASE_URL}/users/unBlock/${userId}`, undefined, {websiteKey: websiteKey});

            if (response.status === 200) {
                toast.success(response.data.message);
                if(role===userRoles.ADMIN) await fetchAdmins();
                if(role === userRoles.CONTRIBUTOR) await fetchUsers(userRoles.CONTRIBUTOR);
                if(role === userRoles.MODERATOR) await fetchUsers(userRoles.MODERATOR);
                if(role === userRoles.SUBSCRIBER) await fetchUsers(userRoles.SUBSCRIBER);
                if(role === StoreRole.USER) await fetchStoreRole(StoreRole.USER);
                if(role === StoreRole.VENDOR) await fetchStoreRole(StoreRole.VENDOR);
                if(role === StoreRole.STOREMODERATOR) await fetchStoreRole(StoreRole.STOREMODERATOR);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            toast.error('Failed to unblock user');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchWebsite(websiteKey);
    }, [websiteKey])

    useEffect(() => {
        if (loading) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        }
    }, [loading]);

    const contextValue: UserContextType = {
        user,
        subscribers,
        contributors,
        moderators,
        adminData,
        isAuthenticated,
        isLoading,
        fetchUsers,
        fetchAdmins,
        changeUserRole,
        changeStoreRole,
        getUserProfile,
        setUser,
        blockUser,
        unblockUser,
        loading,
        setLoading,
        fetchStoreRole,
        vendor,
        storeModerator,
        storeUser,
        website,
        websiteKey,
        setWebsiteKey,
        websiteData,
        setWebsiteData
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