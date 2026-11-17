import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="bg-white min-h-[70vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-neutral-100 border border-neutral-200 text-neutral-900 rounded-xs flex items-center justify-center mx-auto text-2xl font-bold font-mono">
          404
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
            The page you are looking for may have been relocated, renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="/" size="md" variant="primary">
            <Home className="w-4 h-4 mr-1.5" /> Return to Homepage
          </Button>
          <Button href="/services" size="md" variant="outline">
            Browse Services
          </Button>
        </div>

        <div className="pt-4 border-t border-neutral-100 text-xs text-neutral-500">
          Need immediate signage assistance? Call our Edmonton shop at{' '}
          <a href="tel:7805550192" className="text-neutral-900 font-semibold underline underline-offset-2">
            (780) 555-0192
          </a>
        </div>
      </div>
    </div>
  );
}

