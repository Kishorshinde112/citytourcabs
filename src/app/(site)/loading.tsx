import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-[#1A96EB] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-500 font-medium">Loading City Tour Cabs...</span>
      </div>
    </div>
  );
}
