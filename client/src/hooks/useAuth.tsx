'use client'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    // Retrieve the token (or authentication state) from localStorage or cookies
    const user = localStorage.getItem('user'); // Adjust based on your authentication method

    // Redirect to the login page if the token is missing or invalid
    if (!user) {
      router.push('/login');
    }
  }, [router]);
};
