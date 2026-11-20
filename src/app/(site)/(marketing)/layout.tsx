import React from 'react';
import SiteShell from '@/shared/layout/SiteShell';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
