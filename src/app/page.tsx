import React from 'react';
import { getPublishedProjects } from '@/lib/data-store';
import { HeroSection } from '@/components/home/HeroSection';
import { IntroSection } from '@/components/home/IntroSection';
import { ChannelLetterCalculator } from '@/components/calculator/ChannelLetterCalculator';
import { FeaturedProjectsSection } from '@/components/home/FeaturedProjectsSection';
import { WhyChooseUsSection } from '@/components/home/WhyChooseUsSection';
import { ProcessTimelineSection } from '@/components/home/ProcessTimelineSection';
import { HomeCtaSection } from '@/components/home/HomeCtaSection';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const projects = await getPublishedProjects();

  return (
    <>
      <HeroSection />
      <IntroSection />
      <ChannelLetterCalculator />
      <FeaturedProjectsSection projects={projects} />
      <WhyChooseUsSection />
      <ProcessTimelineSection />
      <HomeCtaSection />
    </>
  );
}
