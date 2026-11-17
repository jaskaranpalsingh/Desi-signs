import React from 'react';
import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = constructMetadata({
  title: 'Privacy Policy | Desi Signs Edmonton',
  description: 'Privacy policy for Desi Signs Ltd., Edmonton, Alberta.',
  canonicalUrl: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-6">
          Privacy Policy
        </h1>
        <p className="text-xs text-neutral-500 mb-8">Effective Date: January 1, 2026</p>

        <div className="prose prose-neutral text-sm text-neutral-700 space-y-6 leading-relaxed">
          <p>
            At Desi Signs Ltd. (&ldquo;Desi Signs&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), we respect your privacy and are committed to protecting the personal information you share with us through our website and commercial consultation services.
          </p>

          <h2 className="text-lg font-bold text-neutral-900 pt-4">1. Information We Collect</h2>
          <p>
            When you request a quote, submit an inquiry, or communicate with our Edmonton office, we collect information necessary to prepare commercial estimates, site surveys, and municipal permit applications:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Contact details: Name, email address, phone number.</li>
            <li>Commercial property details: Business name, installation address, facade specifications.</li>
            <li>Artwork and digital vector files provided for signage fabrication.</li>
          </ul>

          <h2 className="text-lg font-bold text-neutral-900 pt-4">2. How We Use Your Information</h2>
          <p>We use your information exclusively to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Prepare accurate commercial estimates and architectural shop drawings.</li>
            <li>Submit permit filings to the City of Edmonton and relevant Alberta authorities.</li>
            <li>Coordinate site surveys and installation scheduling with our crane and rigging crew.</li>
            <li>Respond to customer support and maintenance inquiries.</li>
          </ul>

          <h2 className="text-lg font-bold text-neutral-900 pt-4">3. Data Sharing & Disclosure</h2>
          <p>
            We do not sell, rent, or lease your personal or business data to third-party advertisers. Information may be shared only with municipal permitting offices (such as the City of Edmonton Sustainable Development branch) or certified structural engineers strictly as required to obtain legal signage permits for your property.
          </p>

          <h2 className="text-lg font-bold text-neutral-900 pt-4">4. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy, please contact our privacy representative at:
          </p>
          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs text-xs space-y-1">
            <p><strong>Desi Signs Ltd.</strong></p>
            <p>9845 62 Ave NW, Edmonton, AB, T6E 0E3</p>
            <p>Email: privacy@desisigns.ca | Phone: (780) 555-0192</p>
          </div>
        </div>
      </div>
    </div>
  );
}

