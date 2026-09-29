import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import PlacesWeServe from '../../components/public/PlacesWeServe';

const PlacesPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-6">
        <PlacesWeServe />
      </main>
      <Footer />
    </div>
  );
};

export default PlacesPage;
