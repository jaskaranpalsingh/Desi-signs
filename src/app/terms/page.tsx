import React from 'react';
import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = constructMetadata({
  title: 'Terms and Conditions | Desi Signs Edmonton',
  description: 'Terms and conditions of service for Desi Signs Ltd., Edmonton, Alberta.',
  canonicalUrl: '/terms',
});

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Terms and Conditions' }]} />

        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-6">
          Terms and Conditions
        </h1>
        <p className="text-xs text-neutral-500 mb-8">Effective Date: January 1, 2026</p>

        <div className="prose prose-neutral text-sm text-neutral-700 space-y-6 leading-relaxed">
          <p>
            Please read these Terms and Conditions carefully before contracting fabrication, engineering, or installation services with Desi Signs Ltd.
          </p>

          <h2 className="text-lg font-bold text-neutral-900 pt-4">1. Quotations and Proof Approvals</h2>
          <p>
            All commercial proposals and shop drawing proofs require signed customer authorization prior to material acquisition and CNC cutting. Customers are responsible for verifying color specifications (PMS match), spelling, and dimensional scale before approving final proofs.
          </p>

          <h2 className="text-lg font-bold text-neutral-900 pt-4">2. Municipal Permits & Landlord Approvals</h2>
          <p>
            While Desi Signs acts as applicant on behalf of clients for City of Edmonton Development and Building Permits under Bylaw 12800, municipal permit issuance is subject to municipal zoning guidelines and property landlord criteria. Fees levied directly by municipal authorities remain the responsibility of the property owner unless explicitly bundled into the proposal.
          </p>

          <h2 className="text-lg font-bold text-neutral-900 pt-4">3. Warranty & Workmanship</h2>
          <p>
            All custom fabricated illuminated signs carry our standard 5-year warranty on LED modules, power drivers, and aluminum structural welds against manufacturing defects under normal operating conditions.
          </p>

          <h2 className="text-lg font-bold text-neutral-900 pt-4">4. Governing Law</h2>
          <p>
            These terms are governed by the laws of the Province of Alberta and the federal laws of Canada applicable therein.
          </p>
        </div>
      </div>
    </div>
  );
}

