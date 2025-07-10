// contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

// 1. Define the shape of your context data with an interface
interface AuthContextType {
  isAdmin: boolean;
  login: (password: string) => boolean; // The login function takes a string and returns a boolean
  logout: () => void
}

// 2. Create the context with a default value that matches the type.
// This prevents errors in components that might access the context without a provider.
const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  login: () => false, // A default function that does nothing
  logout: () => {},
});

// 3. Create a custom hook for easy consumption (no changes here)
export function useAuth() {
  return useContext(AuthContext);
}

// 4. Type the props for your Provider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create the Provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const login = (password: string): boolean => {
    // Make sure to set up this environment variable in your .env.local file
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsAdmin(false);

  const value = {
    isAdmin,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}