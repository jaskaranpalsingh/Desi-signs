'use client';

import React, { useState } from 'react';
import { Calculator, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function SignCalculator() {
  const [signType, setSignType] = useState('channel-letters');
  const [width, setWidth] = useState(12);
  const [height, setHeight] = useState(3);
  const [illumination, setIllumination] = useState('front-lit');
  const [includePermit, setIncludePermit] = useState(true);
  const [includeInstallation, setIncludeInstallation] = useState(true);

  // Pricing calculation logic based on industry averages in Edmonton
  const sqft = Math.max(1, width * height);

  const baseRatePerSqFt: Record<string, number> = {
    'channel-letters': 120,
    '3d-letters': 85,
    'storefront-fascia': 95,
    'pylon-monument': 160,
    'led-neon': 75,
  };

  const illuminationMultiplier: Record<string, number> = {
    'front-lit': 1.15,
    'halo-lit': 1.25,
    'non-lit': 0.85,
  };

  const basePrice = sqft * (baseRatePerSqFt[signType] || 100) * (illuminationMultiplier[illumination] || 1);
  const permitCost = includePermit ? 450 : 0;
  const installCost = includeInstallation ? Math.max(650, sqft * 35) : 0;

  const totalEstimateMin = Math.round(basePrice * 0.9 + permitCost + installCost);
  const totalEstimateMax = Math.round(basePrice * 1.15 + permitCost + installCost * 1.2);

  const quoteUrl = `/quote?service=${encodeURIComponent(
    signType === 'channel-letters'
      ? 'Channel Letters (Halo & Front-Lit)'
      : signType === '3d-letters'
      ? '3D Dimensional Architectural Letters'
      : signType === 'storefront-fascia'
      ? 'Storefront Signs & Fascias'
      : signType === 'pylon-monument'
      ? 'Pylon & Monument Signs'
      : 'Custom LED Neon Signs'
  )}`;

  return (
    <div className="bg-white border border-neutral-200 rounded-xs p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
        <div className="w-8 h-8 rounded-xs bg-neutral-900 text-white flex items-center justify-center">
          <Calculator className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-neutral-900">
            Interactive Signage Cost Estimator
          </h3>
          <p className="text-xs text-neutral-500">
            Get an instant ballpark estimate based on standard Edmonton fabrication and installation rates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-neutral-700 mb-1">Sign Category</label>
          <select
            value={signType}
            onChange={(e) => setSignType(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-xs bg-white text-xs"
          >
            <option value="channel-letters">Channel Letters (Face or Halo-Lit)</option>
            <option value="3d-letters">3D Architectural Letters (Non-Lit Metal)</option>
            <option value="storefront-fascia">Storefront Fascia / Lightbox</option>
            <option value="pylon-monument">Freestanding Pylon / Monument</option>
            <option value="led-neon">Custom LED Neon Wall Sign</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-neutral-700 mb-1">
            Approximate Width ({width} feet)
          </label>
          <input
            type="range"
            min="3"
            max="30"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-full accent-neutral-900"
          />
          <span className="text-[11px] text-neutral-500">{width} ft wide</span>
        </div>

        <div>
          <label className="block font-semibold text-neutral-700 mb-1">
            Approximate Height ({height} feet)
          </label>
          <input
            type="range"
            min="1"
            max="12"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full accent-neutral-900"
          />
          <span className="text-[11px] text-neutral-500">{height} ft high ({sqft} sq. ft total)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
        <div>
          <label className="block font-semibold text-neutral-700 mb-1">Illumination</label>
          <select
            value={illumination}
            onChange={(e) => setIllumination(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-xs bg-white text-xs"
          >
            <option value="front-lit">Face-Lit High Output LED</option>
            <option value="halo-lit">Reverse Halo Silhouette (Warm 3000K)</option>
            <option value="non-lit">Non-Illuminated (Solid Metal/Acrylic)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 pt-4">
          <input
            type="checkbox"
            id="permitCheck"
            checked={includePermit}
            onChange={(e) => setIncludePermit(e.target.checked)}
            className="rounded-xs"
          />
          <label htmlFor="permitCheck" className="text-neutral-700 font-medium cursor-pointer">
            City of Edmonton Bylaw Permit Filings
          </label>
        </div>

        <div className="flex items-center gap-2 pt-4">
          <input
            type="checkbox"
            id="installCheck"
            checked={includeInstallation}
            onChange={(e) => setIncludeInstallation(e.target.checked)}
            className="rounded-xs"
          />
          <label htmlFor="installCheck" className="text-neutral-700 font-medium cursor-pointer">
            Crane Rigging & Certified Electrician
          </label>
        </div>
      </div>

      {/* Calculated Result Display */}
      <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-50 p-4 rounded-xs">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold block">
            Estimated Commercial Range:
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight mt-0.5">
            ${totalEstimateMin.toLocaleString()} – ${totalEstimateMax.toLocaleString()}{' '}
            <span className="text-xs font-normal text-neutral-500">CAD + GST</span>
          </div>
          <span className="text-[11px] text-neutral-500 block mt-1">
            Includes UL/CSA sub-zero hardware & 5-year warranty. Final price depends on wall substrate.
          </span>
        </div>

        <Link
          href={quoteUrl}
          className="inline-flex items-center justify-center px-5 py-2.5 bg-brand text-white rounded-lg text-xs font-semibold hover:bg-brand-hover transition-colors shrink-0"
        >
          Lock in Formal Quote <ArrowRight className="ml-1.5 w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

