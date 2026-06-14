'use client';

import { useGuestGuard } from '@/lib/use-guest-guard';
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  const { isReady } = useGuestGuard();

  if (!isReady) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col font-sans bg-[#fffaf0]">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
