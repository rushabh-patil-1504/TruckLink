import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ReviewsSection from '../../components/public/ReviewsSection';

const ReviewsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-6">
        <ReviewsSection />
      </main>
      <Footer />
    </div>
  );
};

export default ReviewsPage;
