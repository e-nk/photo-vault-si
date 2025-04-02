import React from 'react';

export function PhotoLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-photo-primary">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-32 h-32 rounded-full bg-photo-darkgray/30 mb-4"></div>
        <div className="h-6 w-48 bg-photo-darkgray/30 rounded mb-2"></div>
        <div className="h-4 w-64 bg-photo-darkgray/30 rounded"></div>
      </div>
    </div>
  );
}