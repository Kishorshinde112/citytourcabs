import React from 'react';
import { cn } from '@/shared/lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            'w-full px-3.5 py-2.5 rounded-lg border text-sm text-gray-900 bg-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0F6EB8] focus:border-transparent transition-all',
            error ? 'border-red-600' : 'border-gray-300',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
