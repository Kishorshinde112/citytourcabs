import type { Metadata } from 'next';
import PrivacyPolicyClient from './PrivacyPolicyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy | City Tour Cabs',
  description:
    'Read the City Tour Cabs Privacy Policy to understand how we collect, use, and protect your personal information when booking our cabs and tour services.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
