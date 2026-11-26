'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Application Error]', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-gray-50 text-gray-900">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl font-bold font-display text-gray-900">
          Something went wrong
        </h1>
        <p className="text-gray-700 text-sm">
          We encountered an unexpected error while loading this page. Please try refreshing.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#0F6EB8] text-white font-medium hover:bg-[#0B5591] transition-colors cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-gray-300 text-gray-800 font-medium hover:bg-gray-100 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
