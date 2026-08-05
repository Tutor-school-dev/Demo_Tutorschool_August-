"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactNode } from 'react';

interface GoogleAuthProviderProps {
  children: ReactNode;
}

export function GoogleAuthProvider({ children }: GoogleAuthProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;

  // Log for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('Google Client ID:', clientId ? 'Present' : 'Missing');
  }

  if (!clientId) {
    console.error('Google Client ID not found in environment variables');
    console.error('Current environment variables:', {
      NODE_ENV: process.env.NODE_ENV,
      hasClientId: !!process.env.NEXT_PUBLIC_CLIENT_ID
    });
    
    // Return children without Google OAuth provider to prevent the error
    // This allows the app to still function, just without Google login
    return <>{children}</>;
  }

  try {
    return (
      <GoogleOAuthProvider clientId={clientId}>
        {children}
      </GoogleOAuthProvider>
    );
  } catch (error) {
    console.error('Failed to initialize Google OAuth Provider:', error);
    return <>{children}</>;
  }
}