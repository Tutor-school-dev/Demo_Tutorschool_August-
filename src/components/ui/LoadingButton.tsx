"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean;
  loadingText?: string;
}

export const LoadingButton = ({
  children,
  isLoading = false,
  loadingText = "Loading...",
  disabled,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
};