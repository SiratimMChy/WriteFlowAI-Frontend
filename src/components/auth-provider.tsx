"use client"

import React from 'react';
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}

export const useAuth = () => {
  const { data: session, status } = useSession();
  
  return {
    user: session?.user || null,
    loading: status === 'loading',
    login: (provider?: string, options?: any) => signIn(provider, options),
    logout: () => signOut({ callbackUrl: '/' }),
  };
};
