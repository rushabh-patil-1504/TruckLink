import React from 'react';
import HeroSection from '../../components/public/HeroSection';
import ServicesSection from '../../components/public/ServicesSection';
import HowItWorks from '../../components/public/HowItWorks';
import PlacesWeServe from '../../components/public/PlacesWeServe';
import ReviewsSection from '../../components/public/ReviewsSection';
import ContactSection from '../../components/public/ContactSection';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-500 selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <ServicesSection />
        <HowItWorks />
        <PlacesWeServe />
        <ReviewsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
