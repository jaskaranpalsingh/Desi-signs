import React from 'react';
import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import { getPublishedProjects } from '@/lib/data-store';
import AboutPageClient from '@/components/about/AboutPageClient';

export const metadata: Metadata = constructMetadata({
  title: 'About Desi Signs | Local Signage Company in Edmonton, AB',
  description:
    'Desi Naam. Professional Kaam. Your local commercial signage company in Edmonton, Alberta. Storefront signs, 3D channel letters, illuminated signs, and window graphics.',
  canonicalUrl: '/about',
});

export default async function AboutPage() {
  const projects = await getPublishedProjects();
  const showcaseProjects = projects.slice(0, 4);

  return <AboutPageClient showcaseProjects={showcaseProjects} />;
}
