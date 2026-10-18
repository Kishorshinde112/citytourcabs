'use client';

import React from 'react';
import QuickBookModal from './QuickBookModal';

export default function AutoEnquiryModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <QuickBookModal
      isOpen={isOpen}
      onClose={onClose}
      initialData={{ isEnquiry: true, type: 'Inquiry' }}
    />
  );
}
