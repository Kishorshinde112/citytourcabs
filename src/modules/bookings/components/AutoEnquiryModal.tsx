'use client';

import React from 'react';
import QuickBookModal from './QuickBookModal';

export default function AutoEnquiryModal({ isOpen, onClose, initialData = {}, initialDestinations = null }) {
  if (!isOpen) return null;

  return (
    <QuickBookModal
      isOpen={isOpen}
      onClose={onClose}
      initialData={{ isEnquiry: true, type: 'Inquiry', ...initialData }}
      initialDestinations={initialDestinations}
    />
  );
}
