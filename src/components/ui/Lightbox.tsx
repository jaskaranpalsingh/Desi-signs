'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  category?: string;
  location?: string;
}

export function Lightbox({
  isOpen,
  onClose,
  imageUrl,
  title,
  category,
  location,
}: LightboxProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xs p-4 sm:p-6 md:p-10 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close image lightbox"
        className="absolute top-5 right-5 p-2 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-800 transition-colors z-10 cursor-pointer"
      >
        <X className="w-6 h-6" />
      </button>

      <div
        className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-[65vh] sm:h-[75vh]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-contain"
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority
          />
        </div>
        <div className="w-full mt-4 text-center">
          <p className="text-sm font-medium text-white">{title}</p>
          {(category || location) && (
            <p className="text-xs text-neutral-400 mt-1">
              {[category, location].filter(Boolean).join(' • ')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

