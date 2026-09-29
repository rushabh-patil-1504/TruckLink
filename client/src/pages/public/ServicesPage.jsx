import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ServicesSection from '../../components/public/ServicesSection';
import HowItWorks from '../../components/public/HowItWorks';

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-6">
        <ServicesSection />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
