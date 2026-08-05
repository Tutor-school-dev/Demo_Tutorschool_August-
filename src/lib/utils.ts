import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the API URL based on the environment
 * If NEXT_PUBLIC_NODE_ENV is 'staging', use the staging backend
 * Otherwise use the production/default backend
 */
export function getApiUrl(): string {
  const nodeEnv = process.env.NEXT_PUBLIC_NODE_ENV || process.env.NODE_ENV || 'production';
  
  console.log('Environment check:', {
    NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    NODE_ENV: process.env.NODE_ENV,
    resolvedEnv: nodeEnv,
    isStaging: nodeEnv === 'staging'
  });
  
  if (nodeEnv === 'staging') {
    console.log('Using staging API:', process.env.NEXT_PUBLIC_APP_URL);
    console.warn(`CORS Note: Make sure the staging backend at ${process.env.NEXT_PUBLIC_APP_URL} allows origin: http://localhost:3000`);
    return `${process.env.NEXT_PUBLIC_APP_URL}`;
  }
  
  // Default to production API
  const prodUrl = process.env.NEXT_PUBLIC_GO_APP_URL
  console.log('Using production API:', prodUrl);
  return prodUrl;
}

/**
 * Get the main app URL based on environment
 */
export function getAppUrl(): string {
  const nodeEnv = process.env.NEXT_PUBLIC_NODE_ENV || process.env.NODE_ENV || 'production';
  
  if (nodeEnv === 'staging') {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  // Default to production API
  return process.env.NEXT_PUBLIC_APP_URL;
}
