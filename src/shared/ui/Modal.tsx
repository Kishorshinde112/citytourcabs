'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  maxWidth = 'max-w-md',
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity">
      <div
        className={cn(
          'relative w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200',
          maxWidth,
          className
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          {title ? <h3 className="font-bold text-gray-900 text-lg">{title}</h3> : <div />}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6 max-h-[85vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
