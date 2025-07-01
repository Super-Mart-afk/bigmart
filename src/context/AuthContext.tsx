import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { db } from '../lib/db';
import { profiles } from '../lib/schema';
import { eq } from 'drizzle-orm';
import type { Profile } from '../lib/database.types';

interface User extends Profile {
  clerkUser: any;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerkAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      if (clerkUser) {
        fetchOrCreateUserProfile(clerkUser);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    }
  }, [clerkUser, isLoaded]);

  const fetchOrCreateUserProfile = async (clerkUser: any) => {
    try {
      // Try to fetch existing profile
      const existingProfile = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, clerkUser.id))
        .limit(1);

      if (existingProfile.length > 0) {
        setUser({ ...existingProfile[0], clerkUser });
      } else {
        // Create new profile
        const newProfile = {
          id: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: clerkUser.fullName || clerkUser.firstName || 'User',
          role: 'customer' as const,
          status: 'active',
          avatarUrl: clerkUser.imageUrl || null,
          phone: clerkUser.phoneNumbers[0]?.phoneNumber || null,
          address: null,
        };

        await db.insert(profiles).values(newProfile);
        setUser({ ...newProfile, clerkUser });
      }
    } catch (error) {
      console.error('Error fetching/creating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Clerk handles authentication through their components
    // This is kept for compatibility but won't be used directly
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    // Clerk handles registration through their components
    // This is kept for compatibility but won't be used directly
    return false;
  };

  const logout = async (): Promise<void> => {
    await signOut();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<boolean> => {
    if (!user) return false;

    try {
      await db
        .update(profiles)
        .set(updates)
        .where(eq(profiles.id, user.id));

      // Update local user state
      setUser(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isLoading, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};