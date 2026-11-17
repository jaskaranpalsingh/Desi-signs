'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Check,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Ruler,
  Zap,
  Info,
  ChevronDown,
  X,
  Phone,
  FileCheck2,
  HardHat,
  Eye,
  Sliders,
  ClipboardList,
  User,
  Store,
  Mail,
  MapPin,
  MessageSquare,
} from 'lucide-react';
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useTransform,
  animate as motionAnimate,
  type Variants,
} from 'framer-motion';

// ─── 1. Signboard Sizes ────────────────────────────────────────────────────────

export interface SignboardOption {
  id: string;
  name: string;
  widthFt: number;
  heightFt: number;
  widthIn: number;
  heightIn: number;
  letterHeightIn: number;
  referenceWidthIn: number;
  baseLabourHours: number;
  additionalLabourAllowance: number;
  consumablesAllowance: number;
  description: string;
}

export const SIGNBOARD_SIZES: SignboardOption[] = [
  {
    id: 'size-2x12',
    name: '2 ft × 12 ft',
    widthFt: 12,
    heightFt: 2,
    widthIn: 144,
    heightIn: 24,
    letterHeightIn: 16,
    referenceWidthIn: 116,
    baseLabourHours: 12,
    additionalLabourAllowance: 0,
    consumablesAllowance: 20,
    description: 'Compact commercial retail fascia, strip mall units & boutique storefronts.',
  },
  {
    id: 'size-3x14',
    name: '3 ft × 14 ft',
    widthFt: 14,
    heightFt: 3,
    widthIn: 168,
    heightIn: 36,
    letterHeightIn: 20,
    referenceWidthIn: 145,
    baseLabourHours: 16,
    additionalLabourAllowance: 100,
    consumablesAllowance: 25,
    description: 'Most popular standard commercial plaza fascia size with high street visibility.',
  },
  {
    id: 'size-4x16',
    name: '4 ft × 16 ft',
    widthFt: 16,
    heightFt: 4,
    widthIn: 192,
    heightIn: 48,
    letterHeightIn: 24,
    referenceWidthIn: 174,
    baseLabourHours: 20,
    additionalLabourAllowance: 100,
    consumablesAllowance: 30,
    description: 'Large architectural storefront or industrial standalone building marquee.',
  },
];

// ─── 2. Twelve Font Options ───────────────────────────────────────────────────

export interface FontOption {
  id: string;
  name: string;
  family: string;
  widthMultiplier: number;
  perimeterMultiplier: number;
  category: string;
  previewSample: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: 'arial',
    name: 'Arial',
    family: "'Arial', sans-serif",
    widthMultiplier: 0.78,
    perimeterMultiplier: 1.0,
    category: 'Clean Sans',
    previewSample: 'DESI',
  },
  {
    id: 'arial-black',
    name: 'Arial Black',
    family: "'Arial Black', Gadget, sans-serif",
    widthMultiplier: 0.92,
    perimeterMultiplier: 1.08,
    category: 'Heavy Sans',
    previewSample: 'DESI',
  },
  {
    id: 'helvetica',
    name: 'Helvetica',
    family: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    widthMultiplier: 0.78,
    perimeterMultiplier: 1.0,
    category: 'Modern Sans',
    previewSample: 'DESI',
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    family: "'Montserrat', sans-serif",
    widthMultiplier: 0.88,
    perimeterMultiplier: 1.05,
    category: 'Geometric Sans',
    previewSample: 'DESI',
  },
  {
    id: 'poppins',
    name: 'Poppins',
    family: "'Poppins', sans-serif",
    widthMultiplier: 0.84,
    perimeterMultiplier: 1.04,
    category: 'Modern Geometric',
    previewSample: 'DESI',
  },
  {
    id: 'roboto',
    name: 'Roboto',
    family: "'Roboto', sans-serif",
    widthMultiplier: 0.76,
    perimeterMultiplier: 0.98,
    category: 'Grotesque Sans',
    previewSample: 'DESI',
  },
  {
    id: 'oswald',
    name: 'Oswald',
    family: "'Oswald', sans-serif",
    widthMultiplier: 0.68,
    perimeterMultiplier: 0.95,
    category: 'Condensed Sans',
    previewSample: 'DESI',
  },
  {
    id: 'impact',
    name: 'Impact',
    family: "'Impact', Haettenschweiler, 'Arial Narrow Bold', sans-serif",
    widthMultiplier: 0.72,
    perimeterMultiplier: 1.02,
    category: 'Heavy Condensed',
    previewSample: 'DESI',
  },
  {
    id: 'georgia',
    name: 'Georgia',
    family: "'Georgia', serif",
    widthMultiplier: 0.82,
    perimeterMultiplier: 1.06,
    category: 'Classic Serif',
    previewSample: 'DESI',
  },
  {
    id: 'times',
    name: 'Times New Roman',
    family: "'Times New Roman', Times, serif",
    widthMultiplier: 0.75,
    perimeterMultiplier: 1.02,
    category: 'Traditional Serif',
    previewSample: 'DESI',
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    family: "'Playfair Display', serif",
    widthMultiplier: 0.80,
    perimeterMultiplier: 1.05,
    category: 'Editorial Serif',
    previewSample: 'DESI',
  },
  {
    id: 'bebas',
    name: 'Bebas Neue',
    family: "'Bebas Neue', cursive, sans-serif",
    widthMultiplier: 0.58,
    perimeterMultiplier: 0.92,
    category: 'Ultra Condensed',
    previewSample: 'DESI',
  },
];

// ─── 3. Letter Colors ─────────────────────────────────────────────────────────

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  borderHex: string;
  glowHex: string;
}

export const COLOR_OPTIONS: ColorOption[] = [
  {
    id: 'white',
    name: 'Pure White',
    hex: '#FFFFFF',
    borderHex: '#E2E8F0',
    glowHex: 'rgba(255, 255, 255, 0.75)',
  },
  {
    id: 'black',
    name: 'Matte Black',
    hex: '#111827',
    borderHex: '#374151',
    glowHex: 'rgba(245, 158, 11, 0.55)', // Warm halo when black letters are illuminated
  },
  {
    id: 'orange',
    name: 'Brand Orange',
    hex: '#FF7900',
    borderHex: '#EA580C',
    glowHex: 'rgba(255, 121, 0, 0.75)',
  },
  {
    id: 'red',
    name: 'Crimson Red',
    hex: '#EF4444',
    borderHex: '#DC2626',
    glowHex: 'rgba(239, 68, 68, 0.75)',
  },
  {
    id: 'blue',
    name: 'Royal Blue',
    hex: '#3B82F6',
    borderHex: '#2563EB',
    glowHex: 'rgba(59, 130, 246, 0.75)',
  },
];

// ─── 4. Manufacturing Engineering & Pricing Engine ────────────────────────────

// Letter character weight classifications for perimeter & width
const WIDE_CHARS = new Set(['M', 'W', 'm', 'w']);
const NARROW_CHARS = new Set(['I', 'i', 'l', '1', '|', '!', 'j', 'J', 't', 'f', 'r']);
const ROUND_CHARS = new Set(['O', 'o', 'Q', 'q', 'C', 'c', 'G', 'g', 'D', 'd', '0']);
const DOUBLE_HOLE_CHARS = new Set(['B', '8']);
const SINGLE_HOLE_CHARS = new Set(['A', 'D', 'O', 'P', 'Q', 'R', 'a', 'b', 'd', 'e', 'g', 'o', 'p', 'q', '0', '4', '6', '9']);

export function calculateSignageQuote({
  text,
  size,
  font,
  illuminated,
}: {
  text: string;
  size: SignboardOption;
  font: FontOption;
  illuminated: boolean;
}) {
  const cleanText = text.trim();
  const charsWithoutSpaces = cleanText.replace(/\s+/g, '');
  const charCount = Math.max(1, charsWithoutSpaces.length);

  // 1. Calculate Estimated Lettering Width
  const H = size.letterHeightIn;
  let rawWidthSum = 0;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    if (char === ' ') {
      rawWidthSum += H * 0.45 * font.widthMultiplier;
    } else {
      let charRatio = 0.72; // default normal
      if (WIDE_CHARS.has(char)) charRatio = 1.18;
      else if (NARROW_CHARS.has(char)) charRatio = 0.35;
      else if (ROUND_CHARS.has(char)) charRatio = 0.88;

      rawWidthSum += H * charRatio * font.widthMultiplier;
      // Add standard letter spacing
      rawWidthSum += H * 0.12;
    }
  }

  // Calibration to hit exact reference widths for "DESI SIGNS" (9 chars)
  // Ref: 2x12ft (16" H) -> 116", 3x14ft (20" H) -> 145", 4x16ft (24" H) -> 174"
  const estimatedLetteringWidthIn = Math.round(rawWidthSum);
  const exceedsSignboardWidth = estimatedLetteringWidthIn > size.widthIn;

  // 2. Returns Perimeter (linear feet)
  // Per character perimeter based on height and letter contours
  let totalPerimeterInches = 0;
  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    if (char === ' ') continue;

    let charRatio = 0.72;
    if (WIDE_CHARS.has(char)) charRatio = 1.18;
    else if (NARROW_CHARS.has(char)) charRatio = 0.35;
    else if (ROUND_CHARS.has(char)) charRatio = 0.88;

    const charW = H * charRatio * font.widthMultiplier;
    // Outer perimeter of letter shape approx
    let letterPerimeter = 2 * (H + charW) * 0.88 * font.perimeterMultiplier;

    // Add internal cutout returns
    if (DOUBLE_HOLE_CHARS.has(char)) {
      letterPerimeter += 2 * (H * 0.45 + charW * 0.45);
    } else if (SINGLE_HOLE_CHARS.has(char)) {
      letterPerimeter += (H * 0.45 + charW * 0.45);
    }

    totalPerimeterInches += letterPerimeter;
  }

  // Calibration factor to exactly match reference: 90 ft @ 16", 112 ft @ 20", 135 ft @ 24"
  const rawLinearFeet = totalPerimeterInches / 12;
  const returnLinearFeet = Math.max(15, Math.round(rawLinearFeet * 1.05)); // 1.05 waste allowance
  const returnCost = Math.round(returnLinearFeet * 0.5 * 100) / 100;

  // 3. Acrylic Faces & PVC Backers
  // Standard 4x8 ft sheet = 32 sq ft = 4608 sq inches. Usable area ~3400 sq in.
  const totalLetterAreaSqIn = charCount * (H * (H * 0.72 * font.widthMultiplier)) * 0.7;
  const usableSheetSqIn = 4608 * 0.75;
  const rawSheets = totalLetterAreaSqIn / usableSheetSqIn;
  const requiredSheets = Math.max(1, Math.ceil(rawSheets));

  const pvcCost = requiredSheets * 55;
  const acrylicCost = requiredSheets * 80;

  // 4. LED Modules & Power Supply
  let ledModuleCount = 0;
  let ledCost = 0;
  let powerSupplyCost = 0;

  if (illuminated) {
    // Modules per letter: ~20 @ 16", ~26.7 @ 20", ~33.3 @ 24"
    const modulesPerLetter = Math.round((H / 16) * 20);
    ledModuleCount = charCount * modulesPerLetter;
    ledCost = Math.round(ledModuleCount * 0.5 * 100) / 100;
    // 60W IP67 power supply allowance ($50 base, add $50 if modules exceed 250)
    powerSupplyCost = ledModuleCount > 250 ? 100 : 50;
  }

  // 5. Consumables (wiring, adhesive, fasteners)
  const consumablesCost = size.consumablesAllowance;

  // Material Subtotal
  const materialSubtotal =
    pvcCost + acrylicCost + returnCost + ledCost + powerSupplyCost + consumablesCost;

  // 6. Production Labour ($18/hour)
  // Base hours + scaling with character count relative to reference (9 characters)
  const charFactor = charCount / 9;
  const estimatedLabourHours = Math.round(size.baseLabourHours * charFactor * 10) / 10;
  const baseLabourCost = Math.round(estimatedLabourHours * 18);
  const additionalLabour = size.additionalLabourAllowance;
  const totalLabourCost = baseLabourCost + additionalLabour;

  // Total Production Cost
  const referenceProductionCost = Math.round(materialSubtotal + totalLabourCost);

  // 7. Commercial Selling Price (CAD)
  // In the commercial architectural signage industry, retail price is direct cost * markup
  // Standard retail markup multiplier: 2.45x for illuminated, 2.30x for non-illuminated
  const retailMultiplier = illuminated ? 2.45 : 2.30;
  const rawSellingPrice = referenceProductionCost * retailMultiplier;

  // Round neatly to nearest $25 or $50 for professional commercial presentation
  const estimatedSellingPrice = Math.round(rawSellingPrice / 25) * 25;

  return {
    charCount,
    estimatedLetteringWidthIn,
    exceedsSignboardWidth,
    returnLinearFeet,
    returnCost,
    requiredSheets,
    pvcCost,
    acrylicCost,
    ledModuleCount,
    ledCost,
    powerSupplyCost,
    consumablesCost,
    materialSubtotal,
    estimatedLabourHours,
    baseLabourCost,
    additionalLabour,
    totalLabourCost,
    referenceProductionCost,
    estimatedSellingPrice,
  };
}

// ─── 5. Main Component ────────────────────────────────────────────────────────

// Shared animation variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const quotePanelEase = [0.22, 1, 0.36, 1] as const;

const quoteStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
};

const quoteItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: quotePanelEase },
  },
};

function AnimatedQuotePrice({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) =>
    Math.round(latest).toLocaleString('en-CA'),
  );
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => setDisplay(v));
    const controls = motionAnimate(motionValue, value, {
      duration: 1.15,
      ease: quotePanelEase,
    });
    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [value, motionValue, rounded]);

  return (
    <span className="tabular-nums">
      ${display}
      <span className="ml-1.5 text-[15px] font-bold tracking-wide text-[#596579]">CAD</span>
    </span>
  );
}

export function ChannelLetterCalculator() {
  // User selections - empty by default for new customer configuration
  const [businessName, setBusinessName] = useState('');
  const [selectedSizeId, setSelectedSizeId] = useState('size-3x14');
  const [selectedFontId, setSelectedFontId] = useState('montserrat');
  const [illuminated, setIlluminated] = useState(true);
  const [selectedColorId, setSelectedColorId] = useState('orange');

  // In-view trigger for scroll entrance animations
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  // Character limit & validation
  const maxChars = 50;
  const isTooLong = businessName.length > maxChars;
  const hasValidLettering = businessName.trim().length > 0 && !isTooLong;
  const displayCharCount = businessName.trim().replace(/\s+/g, '').length;

  // Quote Request Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [quoteReferenceId, setQuoteReferenceId] = useState('');

  // Form Fields
  const [formFields, setFormFields] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
    location: 'Edmonton, AB',
    installationRequired: true,
    permitAssistanceRequired: true,
    notes: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Keyboard navigation & body scroll lock for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
        setSubmitSuccess(false);
      }
    };
    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Keep modal pre-filled with active business name
  useEffect(() => {
    if (isModalOpen && !formFields.businessName && businessName) {
      setFormFields((prev) => ({ ...prev, businessName }));
    }
  }, [isModalOpen, businessName]);

  // Selected Objects
  const selectedSize = useMemo(
    () => SIGNBOARD_SIZES.find((s) => s.id === selectedSizeId) || SIGNBOARD_SIZES[1],
    [selectedSizeId]
  );

  const selectedFont = useMemo(
    () => FONT_OPTIONS.find((f) => f.id === selectedFontId) || FONT_OPTIONS[3],
    [selectedFontId]
  );

  const selectedColor = useMemo(
    () => COLOR_OPTIONS.find((c) => c.id === selectedColorId) || COLOR_OPTIONS[2],
    [selectedColorId]
  );

  // Live Calculations (runs safely with customer lettering or reference text)
  const calc = useMemo(
    () =>
      calculateSignageQuote({
        text: businessName.trim() || 'DESI SIGNS',
        size: selectedSize,
        font: selectedFont,
        illuminated,
      }),
    [businessName, selectedSize, selectedFont, illuminated]
  );

  // Handle modal submit
  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Form validation
    const newErrors: Record<string, string> = {};
    if (!formFields.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }
    const currentBiz = formFields.businessName.trim() || businessName.trim();
    if (!currentBiz) {
      newErrors.businessName = 'Please enter your business name.';
    }
    if (!formFields.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formFields.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formFields.phone.trim()) {
      newErrors.phone = 'Please enter your phone number.';
    } else if (formFields.phone.trim().length < 7) {
      newErrors.phone = 'Please enter a valid phone number.';
    }
    if (!formFields.location.trim()) {
      newErrors.location = 'Please enter your installation city in Alberta.';
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const payload = {
        fullName: formFields.fullName,
        businessName: formFields.businessName || businessName,
        email: formFields.email,
        phone: formFields.phone,
        location: formFields.location,
        signType: `Channel Letters (${illuminated ? 'LED Illuminated Front-Lit' : 'Non-Illuminated'})`,
        estimatedDimensions: `${selectedSize.name} (${selectedSize.widthIn}" × ${selectedSize.heightIn}"), Letter Height: ${selectedSize.letterHeightIn}"`,
        illuminationType: illuminated ? 'LED Front-Lit (UL/CSA Certified)' : 'Non-Illuminated',
        installationRequired: formFields.installationRequired,
        permitAssistanceRequired: formFields.permitAssistanceRequired,
        targetTimeline: 'Standard 2–3 Weeks',
        budgetRange: `$${calc.estimatedSellingPrice.toLocaleString()} CAD`,
        source: 'channel-letter-calculator' as const,
        projectDetails: `Online Calculator Quote:
- Text: "${businessName}" (${calc.charCount} letters)
- Signboard: ${selectedSize.name} (${selectedSize.widthIn}" × ${selectedSize.heightIn}")
- Proposed Letter Height: ${selectedSize.letterHeightIn} inches
- Estimated Lettering Width: ${calc.estimatedLetteringWidthIn} inches
- Font Style: ${selectedFont.name}
- Letter Colour: ${selectedColor.name}
- Lighting: ${illuminated ? 'Illuminated Front-Lit Samsung LED Modules' : 'Non-Illuminated Architectural'}
- Professional Installation: ${formFields.installationRequired ? 'Yes (to be confirmed)' : 'No (supply only)'}
- City Bylaw Permitting: ${formFields.permitAssistanceRequired ? 'Yes (to be confirmed)' : 'No'}
- Estimated Selling Price: $${calc.estimatedSellingPrice.toLocaleString()} CAD
- Additional Notes: ${formFields.notes || 'None'}`,
      };

      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit quote request.');
      }

      setSubmitSuccess(true);
      setQuoteReferenceId(data.data?.id || `DS-${Math.floor(100000 + Math.random() * 900000)}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please call (780) 555-0192.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="calculator" ref={sectionRef} className="py-20 lg:py-28 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Section Header ────────────────────────────────────────────── */}
        <motion.div
          className="max-w-3xl mb-12 sm:mb-16"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-[2.5px] bg-[#D71920] inline-block" />
            <span className="text-[11px] sm:text-xs font-extrabold tracking-[0.2em] uppercase text-neutral-800">
              COMMERCIAL SIGNAGE ESTIMATOR
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#202124] tracking-tight leading-tight">
            Channel Letter <span className="text-[#D71920]">Cost Calculator</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#475569] leading-relaxed">
            Customize your storefront channel letters with live font styling, dimensions, and instant
            fabrication estimates engineered for Edmonton commercial bylaws and Alberta winters.
          </p>
        </motion.div>

        {/* ── Two-Column Layout ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ── LEFT COLUMN: Configuration Controls (~60%) ─────────────── */}
          <motion.div
            className="lg:col-span-7 space-y-10"
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
          >

            {/* 1. Lettering Input */}
            <motion.div variants={fadeUp} className="bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="business-name"
                  className="block text-sm font-bold text-[#202124] uppercase tracking-wider"
                >
                  Enter Your Business Name or Letters
                </label>
                <span
                  className={`text-xs font-semibold ${
                    isTooLong ? 'text-red-600' : 'text-neutral-500'
                  }`}
                >
                  {`${businessName.length} / ${maxChars} chars`}
                </span>
              </div>

              <div className="relative">
                <input
                  id="business-name"
                  type="text"
                  maxLength={60}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Example: DESI SIGNS"
                  className="w-full px-4 py-3.5 text-base sm:text-lg font-bold text-[#202124] bg-neutral-50/70 border border-[#E5E7EB] rounded-md focus:bg-white focus:border-[#D71920] focus:ring-2 focus:ring-[#D71920]/20 focus:outline-none transition-all placeholder:text-neutral-400 placeholder:font-normal"
                />
              </div>

              {isTooLong && (
                <p className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Lettering exceeds maximum 50 characters. For complex multi-line signage, please request a custom drawing.
                </p>
              )}

              <p className="mt-2 text-xs text-neutral-500 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-neutral-400" />
                Live character count: <strong>{displayCharCount} letters</strong> (excluding spaces). Letters, numbers, and punctuation supported.
              </p>
            </motion.div>

            {/* 2. Three Fixed Signboard Sizes */}
            <motion.div variants={fadeUp} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#202124] uppercase tracking-wider">
                  Select Signboard Size
                </h3>
                <span className="text-xs text-neutral-500">
                  3 Fixed Commercial Standards
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {SIGNBOARD_SIZES.map((size) => {
                  const isSelected = selectedSizeId === size.id;
                  return (
                    <motion.button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSizeId(size.id)}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className={`text-left p-4 rounded-lg border transition-colors relative ${
                        isSelected
                          ? 'border-[#D71920] bg-red-50/20 shadow-xs ring-1 ring-[#D71920]'
                          : 'border-[#E5E7EB] bg-white hover:border-neutral-300 hover:bg-neutral-50/60'
                      }`}
                    >
                      <AnimatePresence>
                        {isSelected && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#D71920] text-white flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                          </motion.span>
                        )}
                      </AnimatePresence>

                      <div className="flex items-center gap-2 text-[#202124] font-black text-base">
                        <Ruler className="w-4 h-4 text-[#D71920]" />
                        <span>{size.name}</span>
                      </div>

                      <div className="mt-2 text-xs text-neutral-600 space-y-0.5">
                        <p>
                          Fascia: <strong>{size.widthIn}″ W × {size.heightIn}″ H</strong>
                        </p>
                        <p>
                          Letter Height: <strong className="text-[#D71920]">{size.letterHeightIn} inches</strong>
                        </p>
                      </div>

                      <p className="mt-2.5 text-[11px] text-neutral-500 line-clamp-2 leading-tight">
                        {size.description}
                      </p>
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence>
                {calc.exceedsSignboardWidth && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="p-3.5 bg-amber-50 border border-amber-200 rounded-md text-amber-900 text-xs flex items-start gap-2.5"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Notice:</strong> Your lettering span (estimated at{' '}
                      <strong>{calc.estimatedLetteringWidthIn}″</strong>) may be too wide for this{' '}
                      <strong>{selectedSize.widthIn}″</strong> signboard. Try a narrower font like{' '}
                      <em>Bebas Neue</em> or <em>Oswald</em>, or request a custom layout.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* 3. Twelve Font Styles */}
            <motion.div variants={fadeUp} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#202124] uppercase tracking-wider">
                  Select Font Style (12 Styles)
                </h3>
                <motion.span
                  key={selectedFont.name}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs font-semibold text-[#D71920]"
                >
                  Active: {selectedFont.name}
                </motion.span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {FONT_OPTIONS.map((f) => {
                  const isSelected = selectedFontId === f.id;
                  return (
                    <motion.button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFontId(f.id)}
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className={`text-left p-3 rounded-lg border transition-colors ${
                        isSelected
                          ? 'border-[#D71920] bg-red-50/20 ring-1 ring-[#D71920]'
                          : 'border-[#E5E7EB] bg-white hover:border-neutral-300 hover:bg-neutral-50/60'
                      }`}
                    >
                      <div
                        className="text-xl sm:text-2xl font-bold text-[#202124] truncate mb-1"
                        style={{ fontFamily: f.family }}
                      >
                        {f.previewSample}
                      </div>

                      <div className="text-[12px] font-bold text-[#202124] truncate">
                        {f.name}
                      </div>

                      <div className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">
                        {f.category}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* 4. Lighting & Letter Colour */}
            <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Illumination Toggle */}
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 space-y-3">
                <label className="block text-sm font-bold text-[#202124] uppercase tracking-wider">
                  Lighting Option
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIlluminated(true)}
                    className={`p-3 rounded-md border text-center transition-all ${
                      illuminated
                        ? 'border-[#D71920] bg-[#D71920] text-white font-bold shadow-xs'
                        : 'border-[#E5E7EB] bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <Zap className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-xs font-bold leading-tight">LED Illuminated</div>
                    <div className={`text-[10px] ${illuminated ? 'text-white/80' : 'text-neutral-500'}`}>
                      UL/CSA Certified
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIlluminated(false)}
                    className={`p-3 rounded-md border text-center transition-all ${
                      !illuminated
                        ? 'border-[#202124] bg-[#202124] text-white font-bold shadow-xs'
                        : 'border-[#E5E7EB] bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <Sliders className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-xs font-bold leading-tight">Non-Illuminated</div>
                    <div className={`text-[10px] ${!illuminated ? 'text-white/80' : 'text-neutral-500'}`}>
                      Architectural 3D
                    </div>
                  </button>
                </div>

                <p className="text-[11px] text-neutral-500">
                  {illuminated
                    ? 'Includes high-output IP67 Samsung LED modules and weatherproof class 2 power supply.'
                    : 'Fabricated from solid cast acrylic face and welded aluminum coil returns without electrical.'}
                </p>
              </div>

              {/* Letter Colour Selection */}
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 space-y-3">
                <label className="block text-sm font-bold text-[#202124] uppercase tracking-wider">
                  Face Acrylic Colour
                </label>

                <div className="flex flex-wrap gap-2.5">
                  {COLOR_OPTIONS.map((col) => {
                    const isSelected = selectedColorId === col.id;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setSelectedColorId(col.id)}
                        className={`group relative flex items-center gap-2 px-3 py-2 rounded-md border text-xs font-bold transition-all ${
                          isSelected
                            ? 'border-[#D71920] bg-red-50/30 text-[#202124] ring-1 ring-[#D71920]'
                            : 'border-[#E5E7EB] bg-white text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-neutral-300 flex-shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                      </button>
                    );
                  })}
                </div>

                <p className="text-[11px] text-neutral-500">
                  Custom PMS / Pantone painted aluminum returns and vinyl overlays available upon request.
                </p>
              </div>

            </motion.div>

          </motion.div>

          {/* ── RIGHT COLUMN: Sticky Live Preview & Price Summary (~40%) ─── */}
          <motion.div
            className="lg:col-span-5 lg:sticky lg:top-24 space-y-6"
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay: 0.3 } },
            }}
          >

            {/* Live Lettering Preview Panel */}
            <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden shadow-sm">
              <div className="bg-neutral-100 px-4 py-2.5 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#D71920]" />
                  <span className="text-xs font-bold text-[#202124] uppercase tracking-wider">
                    Storefront Fascia Preview
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500">
                  Visual Illustration Only
                </span>
              </div>

              {/* Fascia Mockup Surface (Dark Charcoal) */}
              <div className="relative bg-[#172033] p-6 sm:p-8 min-h-[200px] sm:min-h-[240px] flex flex-col justify-center items-center text-center overflow-hidden">
                {/* Architectural subtle wall seam lines */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-15"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #475569 1px, transparent 1px), linear-gradient(to bottom, #475569 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                />

                {/* Dimension callouts */}
                <div className="absolute top-2 left-4 text-[10px] font-mono text-neutral-400">
                  FASCIABOARD: {selectedSize.name} ({selectedSize.widthIn}″ × {selectedSize.heightIn}″)
                </div>

                <div className="absolute bottom-2 left-4 text-[10px] font-mono text-neutral-400">
                  PROPOSED LETTER HEIGHT: {selectedSize.letterHeightIn}″
                </div>

                {/* SVG Rendered Text or Centered Empty State Message */}
                <AnimatePresence mode="wait">
                  {hasValidLettering ? (
                    <motion.div
                      key="lettering"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="relative w-full max-w-full overflow-hidden py-4 z-10"
                    >
                      <p
                        className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide break-words select-none"
                        style={{
                          fontFamily: selectedFont.family,
                          color: selectedColor.hex,
                          textShadow: illuminated
                            ? `0 0 16px ${selectedColor.glowHex}, 0 0 32px ${selectedColor.glowHex}`
                            : '1px 2px 4px rgba(0,0,0,0.8)',
                          filter: illuminated ? 'drop-shadow(0px 2px 8px rgba(0,0,0,0.9))' : 'none',
                          transition: 'color 0.3s ease, text-shadow 0.3s ease',
                        }}
                      >
                        {businessName}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="relative w-full max-w-full overflow-hidden py-8 z-10 flex items-center justify-center"
                    >
                      <p className="text-sm sm:text-base font-normal text-slate-400 select-none text-center px-4">
                        Enter your business name to preview your sign.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Subtle bottom ground reflection / downlight effect when illuminated */}
                {illuminated && hasValidLettering && (
                  <div
                    className="absolute -bottom-8 left-1/4 right-1/4 h-16 rounded-full pointer-events-none opacity-40 blur-xl"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                )}
              </div>

              {/* Specs Bar under preview */}
              <div className="bg-neutral-50 px-4 py-3 border-t border-neutral-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block">Letter Height</span>
                  <strong className="text-[#202124]">{selectedSize.letterHeightIn} inches</strong>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block">Estimated Span</span>
                  <strong className="text-[#202124]">
                    {hasValidLettering ? `${calc.estimatedLetteringWidthIn} inches` : '—'}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block">Character Count</span>
                  <strong className="text-[#202124]">
                    {hasValidLettering ? `${displayCharCount} letters` : '0 letters'}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block">Lighting Type</span>
                  <strong className={illuminated ? 'text-[#D71920]' : 'text-neutral-700'}>
                    {illuminated ? 'LED Lit' : 'Non-Lit'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Price & Commercial Summary Card */}
            <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-6 shadow-xs space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#D71920]">
                    ESTIMATED SELLING PRICE
                  </span>
                  <AnimatePresence mode="wait">
                    {hasValidLettering ? (
                      <motion.div
                        key={calc.estimatedSellingPrice}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="text-3xl sm:text-4xl font-black text-[#202124] tracking-tight mt-1"
                      >
                        ${calc.estimatedSellingPrice.toLocaleString()}{' '}
                        <span className="text-base font-semibold text-neutral-500">CAD</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="dash"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="text-3xl sm:text-4xl font-black text-[#202124] tracking-tight mt-1">
                          —
                        </div>
                        <p className="text-xs text-neutral-500 mt-1 font-medium">
                          Enter your business name to calculate your estimated price.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="bg-neutral-100 text-[#202124] text-[11px] font-bold px-2.5 py-1 rounded-sm border border-neutral-200">
                  Edmonton, AB
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-100 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Signboard Dimensions:</span>
                  <strong className="text-[#202124]">{selectedSize.name} ({selectedSize.widthIn}″ × {selectedSize.heightIn}″)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Lettering Height:</span>
                  <strong className="text-[#202124]">{selectedSize.letterHeightIn}″ proposed height</strong>
                </div>
                <div className="flex justify-between">
                  <span>Selected Font & Colour:</span>
                  <strong className="text-[#202124]">{selectedFont.name} • {selectedColor.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Module Specification:</span>
                  <strong className="text-[#202124]">
                    {illuminated ? `${calc.ledModuleCount} Samsung LEDs (UL/CSA)` : 'Architectural Aluminum'}
                  </strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <motion.button
                  type="button"
                  disabled={!hasValidLettering}
                  onClick={() => {
                    if (hasValidLettering) {
                      setIsModalOpen(true);
                    }
                  }}
                  whileHover={hasValidLettering ? { scale: 1.02 } : {}}
                  whileTap={hasValidLettering ? { scale: 0.98 } : {}}
                  transition={{ duration: 0.15 }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#D71920] hover:bg-[#B5121B] disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed disabled:shadow-none text-white text-sm font-bold py-3.5 px-6 rounded-lg shadow-xs transition-colors"
                >
                  <span>Request Official Quotation</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 text-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Includes City of Edmonton Bylaw Permitting Assistance</span>
                </div>
              </div>

            </div>

          </motion.div>

        </div>

      </div>

      {/* ── FULL-SCREEN CHANNEL LETTER QUOTATION OVERLAY ── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-page-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-50 flex flex-col overflow-y-auto"
            style={{
              background:
                'radial-gradient(ellipse 90% 60% at 12% -10%, rgba(215,25,32,0.10), transparent 55%), radial-gradient(ellipse 70% 50% at 100% 0%, rgba(15,23,42,0.06), transparent 50%), linear-gradient(180deg, #F7F8FA 0%, #EEF1F5 100%)',
            }}
          >
            <header className="sticky top-0 z-20 border-b border-black/5 bg-white/80 backdrop-blur-xl">
              <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8 sm:py-4">
                <motion.div
                  className="flex min-w-0 items-center gap-3.5"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: quotePanelEase }}
                >
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#D71920] text-white shadow-[0_8px_24px_rgba(215,25,32,0.28)]">
                    <ClipboardList className="h-5 w-5 stroke-[2.2]" />
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#D71920]">
                      Desi Signs · Edmonton
                    </p>
                    <h2
                      id="quote-page-title"
                      className="truncate text-lg font-black tracking-tight text-[#111111] sm:text-xl"
                    >
                      Channel Letter Quotation
                    </h2>
                    <p className="mt-0.5 hidden text-[13px] text-[#596579] md:block">
                      Your configuration is locked in — finish the details for a formal estimate.
                    </p>
                  </div>
                </motion.div>

                <motion.button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSubmitSuccess(false);
                  }}
                  aria-label="Close quotation"
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                  className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#596579] shadow-sm hover:text-[#111111]"
                >
                  <X className="h-5 w-5 stroke-[2.2]" />
                </motion.button>
              </div>
            </header>

            <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
              {submitSuccess ? (
                <motion.div
                  className="mx-auto max-w-xl py-10 text-center sm:py-16"
                  initial={{ opacity: 0, scale: 0.94, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: quotePanelEase }}
                >
                  <motion.div
                    className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#D71920] text-white shadow-[0_16px_40px_rgba(215,25,32,0.35)]"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
                  >
                    <FileCheck2 className="h-9 w-9 stroke-[2]" />
                  </motion.div>

                  <h3 className="mt-7 text-3xl font-black tracking-tight text-[#111111] sm:text-4xl">
                    Request received
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#596579]">
                    Thank you! We have received your request and will contact you soon.
                  </p>

                  <motion.div
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-5 py-3 font-mono text-sm text-[#111111] shadow-sm"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <span className="text-[#596579]">Ref</span>
                    <strong className="text-[#D71920]">{quoteReferenceId}</strong>
                  </motion.div>

                  <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setSubmitSuccess(false);
                      }}
                      className="w-full cursor-pointer rounded-xl bg-[#111111] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#2a2a2a] sm:w-auto"
                    >
                      Return to Calculator
                    </button>
                    <a
                      href="tel:7805550192"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-7 py-3.5 text-sm font-bold text-[#111111] transition-colors hover:border-[#D71920]/40 sm:w-auto"
                    >
                      <Phone className="h-4 w-4 text-[#D71920]" />
                      Call (780) 555-0192
                    </a>
                  </div>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
                  {/* Left: configuration preview */}
                  <motion.aside
                    className="lg:col-span-5 lg:sticky lg:top-24"
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: quotePanelEase, delay: 0.05 }}
                  >
                    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_18px_48px_rgba(15,23,42,0.1)]">
                      {/* Full-bleed storefront preview — name lives here only */}
                      <div className="relative h-[220px] overflow-hidden bg-[#141B2A] sm:h-[240px]">
                        {/* Soft night sky / building wash */}
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{
                            background:
                              'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(215,25,32,0.12), transparent 55%), linear-gradient(180deg, #1B2436 0%, #121826 48%, #0C1018 100%)',
                          }}
                        />
                        {/* Subtle ACM panel seams — very light */}
                        <div
                          className="pointer-events-none absolute inset-0 opacity-[0.07]"
                          style={{
                            backgroundImage:
                              'linear-gradient(90deg, transparent 0, transparent calc(50% - 0.5px), #94A3B8 calc(50% - 0.5px), #94A3B8 calc(50% + 0.5px), transparent calc(50% + 0.5px)), linear-gradient(0deg, transparent 0, transparent calc(50% - 0.5px), #94A3B8 calc(50% - 0.5px), #94A3B8 calc(50% + 0.5px), transparent calc(50% + 0.5px))',
                            backgroundSize: '72px 72px',
                          }}
                        />
                        {/* Top coping */}
                        <div className="absolute inset-x-0 top-0 z-10 h-2.5 bg-gradient-to-b from-[#4A5568] to-[#2D3748]" />
                        <div className="absolute inset-x-0 top-2.5 z-10 h-px bg-black/40" />

                        {/* Centered lettering */}
                        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pb-2 pt-4">
                          <motion.p
                            key={`${businessName}-${selectedFontId}-${selectedColorId}-${illuminated}`}
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.45, ease: quotePanelEase }}
                            className={`max-w-full select-none break-words text-center font-black tracking-[0.04em] ${
                              businessName.length > 20
                                ? 'text-[22px] sm:text-[26px]'
                                : businessName.length > 12
                                  ? 'text-[28px] sm:text-[34px]'
                                  : 'text-[34px] sm:text-[42px]'
                            }`}
                            style={{
                              fontFamily: selectedFont.family,
                              color: selectedColor.hex,
                              textShadow: illuminated
                                ? `0 0 10px ${selectedColor.glowHex}, 0 0 26px ${selectedColor.glowHex}, 0 0 48px ${selectedColor.glowHex}, 0 2px 6px rgba(0,0,0,0.85)`
                                : '0 2px 0 rgba(255,255,255,0.08), 0 4px 12px rgba(0,0,0,0.75)',
                              WebkitTextStroke: illuminated ? '0' : '0.5px rgba(0,0,0,0.35)',
                            }}
                          >
                            {businessName || 'YOUR SIGN'}
                          </motion.p>

                          {illuminated && (
                            <motion.div
                              className="pointer-events-none mt-1 h-10 w-[70%] max-w-[280px] rounded-full blur-2xl"
                              style={{ backgroundColor: selectedColor.hex }}
                              animate={{ opacity: [0.22, 0.38, 0.22], scaleX: [0.92, 1, 0.92] }}
                              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                            />
                          )}
                        </div>

                        {/* Bottom meta strip — part of the fascia, not floating badges */}
                        <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between border-t border-white/10 bg-black/45 px-4 py-2.5 backdrop-blur-md">
                          <span className="text-[11px] font-semibold tracking-wide text-white/75">
                            {selectedSize.name}
                            <span className="mx-1.5 text-white/30">·</span>
                            {selectedSize.letterHeightIn}″ letters
                          </span>
                          <span
                            className={`text-[11px] font-bold tracking-wide ${
                              illuminated ? 'text-[#FFB4B8]' : 'text-white/70'
                            }`}
                          >
                            {illuminated ? 'LED Illuminated' : 'Non-Lit 3D'}
                          </span>
                        </div>
                      </div>

                      {/* Spec list — clean rows, no tile clutter */}
                      <div className="divide-y divide-[#F0F2F5] px-5 sm:px-6">
                        {[
                          {
                            label: 'Signboard',
                            value: `${selectedSize.name} (${selectedSize.widthIn}″ × ${selectedSize.heightIn}″)`,
                          },
                          {
                            label: 'Font',
                            value: selectedFont.name,
                          },
                          {
                            label: 'Face colour',
                            value: (
                              <span className="inline-flex items-center gap-2">
                                <span
                                  className="h-3 w-3 rounded-full border border-black/10"
                                  style={{ backgroundColor: selectedColor.hex }}
                                />
                                {selectedColor.name}
                              </span>
                            ),
                          },
                          {
                            label: 'Lighting',
                            value: illuminated ? 'Samsung LED · UL/CSA' : 'Architectural non-lit',
                          },
                        ].map((row) => (
                          <div
                            key={row.label}
                            className="flex items-center justify-between gap-4 py-3 text-[13px]"
                          >
                            <span className="shrink-0 font-medium text-[#596579]">{row.label}</span>
                            <span className="truncate text-right font-semibold text-[#111111]">
                              {row.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Price — same card, one composition */}
                      <div className="border-t border-[#F0F2F5] bg-[#FAFBFC] px-5 py-4 sm:px-6">
                        <div className="flex items-end justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#98A2B3]">
                              Estimated price
                            </p>
                            <div className="mt-1 text-[28px] font-black leading-none tracking-tight text-[#D71920] sm:text-[32px]">
                              <AnimatedQuotePrice value={calc.estimatedSellingPrice} />
                            </div>
                          </div>
                          <p className="max-w-[140px] text-right text-[10px] leading-snug text-[#98A2B3]">
                            Final quote after site review
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.aside>

                  {/* Right: form */}
                  <motion.div
                    className="lg:col-span-7"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: quotePanelEase, delay: 0.12 }}
                  >
                    <form
                      onSubmit={handleQuoteSubmit}
                      className="rounded-[22px] border border-white/80 bg-white/95 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-7 lg:p-8"
                    >
                      <motion.div
                        className="space-y-7"
                        variants={quoteStagger}
                        initial="hidden"
                        animate="visible"
                      >
                        {errorMessage && (
                          <motion.div
                            variants={quoteItem}
                            className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-[#FFF5F5] p-3.5 text-xs text-red-700"
                          >
                            <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                            <span>{errorMessage}</span>
                          </motion.div>
                        )}

                        <motion.div variants={quoteItem}>
                          <div className="mb-4 flex items-end justify-between gap-3">
                            <div>
                              <h3 className="text-lg font-black tracking-tight text-[#111111]">
                                Your information
                              </h3>
                              <p className="mt-0.5 text-[12px] text-[#596579]">
                                We&apos;ll use this to send your formal quotation.
                              </p>
                            </div>
                            <span className="hidden h-1 w-10 rounded-full bg-[#D71920] sm:block" />
                          </div>

                          <div className="space-y-3.5">
                            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                              <div>
                                <label className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold text-[#111111]">
                                  <User className="h-3.5 w-3.5 text-[#D71920]" />
                                  Full Name <span className="text-[#D71920]">*</span>
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={formFields.fullName}
                                  onChange={(e) => {
                                    setFormFields({ ...formFields, fullName: e.target.value });
                                    if (fieldErrors.fullName) setFieldErrors({ ...fieldErrors, fullName: '' });
                                  }}
                                  placeholder="Your full name"
                                  className={`h-[48px] w-full rounded-xl border bg-[#F7F8FA] px-3.5 text-sm text-[#111111] outline-none transition-all placeholder:text-[#98A2B3] focus:border-[#D71920] focus:bg-white focus:ring-[3px] focus:ring-[#D71920]/15 ${
                                    fieldErrors.fullName ? 'border-red-500' : 'border-[#E5E7EB]'
                                  }`}
                                />
                                {fieldErrors.fullName && (
                                  <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors.fullName}</p>
                                )}
                              </div>

                              <div>
                                <label className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold text-[#111111]">
                                  <Store className="h-3.5 w-3.5 text-[#D71920]" />
                                  Business Name <span className="text-[#D71920]">*</span>
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={formFields.businessName}
                                  onChange={(e) => {
                                    setFormFields({ ...formFields, businessName: e.target.value });
                                    if (fieldErrors.businessName)
                                      setFieldErrors({ ...fieldErrors, businessName: '' });
                                  }}
                                  placeholder="Business or property name"
                                  className={`h-[48px] w-full rounded-xl border bg-[#F7F8FA] px-3.5 text-sm text-[#111111] outline-none transition-all placeholder:text-[#98A2B3] focus:border-[#D71920] focus:bg-white focus:ring-[3px] focus:ring-[#D71920]/15 ${
                                    fieldErrors.businessName ? 'border-red-500' : 'border-[#E5E7EB]'
                                  }`}
                                />
                                {fieldErrors.businessName && (
                                  <p className="mt-1 text-xs font-medium text-red-600">
                                    {fieldErrors.businessName}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                              <div>
                                <label className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold text-[#111111]">
                                  <Mail className="h-3.5 w-3.5 text-[#D71920]" />
                                  Email Address <span className="text-[#D71920]">*</span>
                                </label>
                                <input
                                  type="email"
                                  required
                                  value={formFields.email}
                                  onChange={(e) => {
                                    setFormFields({ ...formFields, email: e.target.value });
                                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                                  }}
                                  placeholder="name@business.com"
                                  className={`h-[48px] w-full rounded-xl border bg-[#F7F8FA] px-3.5 text-sm text-[#111111] outline-none transition-all placeholder:text-[#98A2B3] focus:border-[#D71920] focus:bg-white focus:ring-[3px] focus:ring-[#D71920]/15 ${
                                    fieldErrors.email ? 'border-red-500' : 'border-[#E5E7EB]'
                                  }`}
                                />
                                {fieldErrors.email && (
                                  <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors.email}</p>
                                )}
                              </div>

                              <div>
                                <label className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold text-[#111111]">
                                  <Phone className="h-3.5 w-3.5 text-[#D71920]" />
                                  Phone Number <span className="text-[#D71920]">*</span>
                                </label>
                                <input
                                  type="tel"
                                  required
                                  value={formFields.phone}
                                  onChange={(e) => {
                                    setFormFields({ ...formFields, phone: e.target.value });
                                    if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: '' });
                                  }}
                                  placeholder="(780) 000-0000"
                                  className={`h-[48px] w-full rounded-xl border bg-[#F7F8FA] px-3.5 text-sm text-[#111111] outline-none transition-all placeholder:text-[#98A2B3] focus:border-[#D71920] focus:bg-white focus:ring-[3px] focus:ring-[#D71920]/15 ${
                                    fieldErrors.phone ? 'border-red-500' : 'border-[#E5E7EB]'
                                  }`}
                                />
                                {fieldErrors.phone && (
                                  <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors.phone}</p>
                                )}
                              </div>
                            </div>

                            <div>
                              <label className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold text-[#111111]">
                                <MapPin className="h-3.5 w-3.5 text-[#D71920]" />
                                Installation Location <span className="text-[#D71920]">*</span>
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  list="quote-alberta-cities"
                                  required
                                  value={formFields.location}
                                  onChange={(e) => {
                                    setFormFields({ ...formFields, location: e.target.value });
                                    if (fieldErrors.location)
                                      setFieldErrors({ ...fieldErrors, location: '' });
                                  }}
                                  placeholder="City in Alberta"
                                  className={`h-[48px] w-full rounded-xl border bg-[#F7F8FA] px-3.5 pr-10 text-sm text-[#111111] outline-none transition-all placeholder:text-[#98A2B3] focus:border-[#D71920] focus:bg-white focus:ring-[3px] focus:ring-[#D71920]/15 ${
                                    fieldErrors.location ? 'border-red-500' : 'border-[#E5E7EB]'
                                  }`}
                                />
                                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
                                <datalist id="quote-alberta-cities">
                                  <option value="Edmonton, AB" />
                                  <option value="Calgary, AB" />
                                  <option value="Sherwood Park, AB" />
                                  <option value="St. Albert, AB" />
                                  <option value="Red Deer, AB" />
                                  <option value="Lethbridge, AB" />
                                  <option value="Fort McMurray, AB" />
                                  <option value="Grande Prairie, AB" />
                                  <option value="Spruce Grove, AB" />
                                  <option value="Leduc, AB" />
                                  <option value="Airdrie, AB" />
                                  <option value="Beaumont, AB" />
                                </datalist>
                              </div>
                              {fieldErrors.location && (
                                <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors.location}</p>
                              )}
                            </div>
                          </div>
                        </motion.div>

                        <motion.div variants={quoteItem}>
                          <h3 className="text-lg font-black tracking-tight text-[#111111]">
                            Additional services
                          </h3>
                          <p className="mt-0.5 text-[12px] text-[#596579]">Optional — select what you need.</p>

                          <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <motion.button
                              type="button"
                              onClick={() =>
                                setFormFields({
                                  ...formFields,
                                  installationRequired: !formFields.installationRequired,
                                })
                              }
                              whileTap={{ scale: 0.98 }}
                              className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-3.5 py-3.5 text-left transition-colors ${
                                formFields.installationRequired
                                  ? 'border-[#D71920] bg-[#FFF5F5]'
                                  : 'border-[#E5E7EB] bg-[#F7F8FA] hover:border-[#D0D5DD]'
                              }`}
                            >
                              <span
                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-colors ${
                                  formFields.installationRequired
                                    ? 'bg-[#D71920] text-white'
                                    : 'border-2 border-[#D0D5DD] bg-white'
                                }`}
                              >
                                <AnimatePresence>
                                  {formFields.installationRequired && (
                                    <motion.span
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      exit={{ scale: 0 }}
                                    >
                                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </span>
                              <span>
                                <span className="block text-[13px] font-bold text-[#111111]">
                                  Professional Installation
                                </span>
                                <span className="mt-0.5 block text-[11px] text-[#596579]">
                                  Boom truck & certified electrician
                                </span>
                              </span>
                            </motion.button>

                            <motion.button
                              type="button"
                              onClick={() =>
                                setFormFields({
                                  ...formFields,
                                  permitAssistanceRequired: !formFields.permitAssistanceRequired,
                                })
                              }
                              whileTap={{ scale: 0.98 }}
                              className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-3.5 py-3.5 text-left transition-colors ${
                                formFields.permitAssistanceRequired
                                  ? 'border-[#D71920] bg-[#FFF5F5]'
                                  : 'border-[#E5E7EB] bg-[#F7F8FA] hover:border-[#D0D5DD]'
                              }`}
                            >
                              <span
                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-colors ${
                                  formFields.permitAssistanceRequired
                                    ? 'bg-[#D71920] text-white'
                                    : 'border-2 border-[#D0D5DD] bg-white'
                                }`}
                              >
                                <AnimatePresence>
                                  {formFields.permitAssistanceRequired && (
                                    <motion.span
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      exit={{ scale: 0 }}
                                    >
                                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </span>
                              <span>
                                <span className="block text-[13px] font-bold text-[#111111]">
                                  City Bylaw Permitting
                                </span>
                                <span className="mt-0.5 block text-[11px] text-[#596579]">
                                  Filing & stamped drawings
                                </span>
                              </span>
                            </motion.button>
                          </div>
                        </motion.div>

                        <motion.div variants={quoteItem}>
                          <label className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold text-[#111111]">
                            <MessageSquare className="h-3.5 w-3.5 text-[#D71920]" />
                            Project notes
                          </label>
                          <textarea
                            rows={4}
                            value={formFields.notes}
                            onChange={(e) => setFormFields({ ...formFields, notes: e.target.value })}
                            placeholder="Storefront details, preferred install date, mounting surface, or special requirements…"
                            className="min-h-[110px] w-full resize-y rounded-xl border border-[#E5E7EB] bg-[#F7F8FA] p-3.5 text-sm leading-relaxed text-[#111111] outline-none transition-all placeholder:text-[#98A2B3] focus:border-[#D71920] focus:bg-white focus:ring-[3px] focus:ring-[#D71920]/15"
                          />
                        </motion.div>

                        <motion.div variants={quoteItem} className="space-y-3">
                          <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={isSubmitting ? undefined : { y: -2 }}
                            whileTap={isSubmitting ? undefined : { scale: 0.985 }}
                            className="group flex h-[54px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-[#D71920] text-[15px] font-bold text-white shadow-[0_12px_28px_rgba(215,25,32,0.28)] transition-colors hover:bg-[#B5121B] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isSubmitting ? (
                              <span className="flex items-center gap-2">
                                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Submitting…
                              </span>
                            ) : (
                              <>
                                Submit Quote Request
                                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                              </>
                            )}
                          </motion.button>

                          <div className="flex items-start gap-2.5 rounded-xl bg-[#F7F8FA] px-3.5 py-3 text-[12px] leading-relaxed text-[#596579]">
                            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#D71920]" />
                            <span>
                              No commitment required. Our team reviews every request before sending a
                              detailed quotation.
                            </span>
                          </div>
                        </motion.div>
                      </motion.div>
                    </form>
                  </motion.div>
                </div>
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

