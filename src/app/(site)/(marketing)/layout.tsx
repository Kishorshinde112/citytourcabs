import React from 'react';
import SiteShell from '@/shared/layout/SiteShell';
import { getFooter, getNavigation, getSiteSettings } from '@/lib/cmsGlobals';
import { getTourLinks } from '@/modules/tours/queries';

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [siteSettings, navigation, footer, tourLinks] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
    getFooter(),
    getTourLinks(),
  ]);

  return (
    <SiteShell
      siteSettings={siteSettings}
      navigation={navigation}
      footer={footer}
      tourLinks={tourLinks}
    >
      {children}
    </SiteShell>
  );
}
