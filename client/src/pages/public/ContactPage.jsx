import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ContactSection from '../../components/public/ContactSection';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-6">
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
