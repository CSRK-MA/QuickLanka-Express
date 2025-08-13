import React, { useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import ServiceCards from '../components/home/ServiceCards';
import HowItWorks from '../components/home/HowItWorks';
import CtaSection from '../components/home/CtaSection';
import TestimonialSection from '../components/home/TestimonialSection';

const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'QuickLanka Express - Smart, Fast & Reliable Deliveries Islandwide';
  }, []);

  return (
    <div>
      <HeroSection />
      <ServiceCards />
      <HowItWorks />
      <CtaSection />
      <TestimonialSection />
    </div>
  );
};

export default HomePage;