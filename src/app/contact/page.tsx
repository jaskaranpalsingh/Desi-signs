import React from 'react';
import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import { getSettings } from '@/lib/data-store';
import { ContactPageClient } from '@/components/contact/ContactPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = constructMetadata({
  title: 'Contact Desi Signs | Edmonton Signage Fabrication Facility',
  description:
    'Contact Desi Signs in Edmonton, AB. Speak with our signage designers, request site surveys, or visit our local manufacturing shop at 9845 62 Ave NW.',
  canonicalUrl: '/contact',
});

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <ContactPageClient
      settings={{
        phone: settings.phone,
        email: settings.email,
        address: settings.address,
        city: settings.city,
        province: settings.province,
        postalCode: settings.postalCode,
        country: settings.country,
        businessHours: settings.businessHours,
        serviceArea: settings.serviceArea,
      }}
    />
  );
}
