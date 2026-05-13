import React from 'react';
import HeroSection from './components/HeroSection';
import AnnouncementSection from './components/AnnouncementSection';
import ItineraryList from './components/ItineraryList';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <AnnouncementSection />
      <ItineraryList />
    </main>
  );
}
