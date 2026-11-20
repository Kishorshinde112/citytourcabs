import React from 'react';
import { cn } from '@/shared/lib/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'accent';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

    const variants = {
      primary: 'bg-[#1A96EB] hover:bg-[#1578BC] text-white shadow-xs focus:ring-[#1A96EB]',
      secondary: 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 focus:ring-gray-400',
      outline: 'bg-transparent border border-[#1A96EB] text-[#1A96EB] hover:bg-blue-50 focus:ring-[#1A96EB]',
      accent: 'bg-orange-600 hover:bg-orange-700 text-white shadow-xs focus:ring-orange-500',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5',
      md: 'text-sm px-4 py-2.5',
      lg: 'text-base px-6 py-3',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
