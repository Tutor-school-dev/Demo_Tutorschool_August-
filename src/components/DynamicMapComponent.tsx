"use client";

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

interface MapComponentProps {
  formData: any;
  setFormData: (data: any) => void;
}

// Dynamically import the map component to avoid SSR issues
const DynamicMapComponent = dynamic(
  () => import('./SimpleMapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center bg-gray-100 rounded-lg w-full h-64">
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }
) as ComponentType<MapComponentProps>;

export default DynamicMapComponent;