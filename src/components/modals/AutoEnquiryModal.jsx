'use client';

import React from 'react';
import QuickBookModal from './QuickBookModal';

export default function AutoEnquiryModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <QuickBookModal
      isOpen={isOpen}
      onClose={() => {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('enquiry_popup_seen', 'true');
        }
        onClose();
      }}
      initialData={{ isEnquiry: true, type: 'Inquiry' }}
    />
  );
}
