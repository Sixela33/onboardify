import { createContext, useContext, ReactNode } from 'react';
import axiosInstance from '../lib/axiosInstance';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface UserInfo {
    avatarUrl: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface UserContextType {
  user: UserInfo | undefined;
  isLoading: boolean;
  error: Error | null;
  refetchUser: () => Promise<void>;
  handleLogout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();

    const fetchUserData = async (): Promise<UserInfo> => {
        const res = await axiosInstance.get('/user/profile');
        return res.data;
    }

    const { data: user, isLoading, error } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUserData,
        retry: false,
    });

    const refetchUser = async () => {
        queryClient.invalidateQueries({ queryKey: ['user'] });
    }

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/auth/signout');
            queryClient.invalidateQueries({ queryKey: ['user'] });
            refetchUser();
            window.location.href = '/';
        } catch (error) {
            console.error(error);
        }
    }

  return (
    <UserContext.Provider value={{ user, isLoading, error, refetchUser, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 