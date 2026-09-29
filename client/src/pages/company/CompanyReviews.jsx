import React, { useState, useEffect } from 'react';
import { Star, Building2, Route } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import CompanyHeader from '../../components/company/CompanyHeader';
import API from '../../services/api';

const CompanyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/companies/bookings')
      .then((res) => {
        const reviewedList = res.data.filter((b) => b.review);
        setReviews(reviewedList.map((b) => b.review));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <CompanyHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow space-y-6 w-full">
        <div className="space-y-1">
          <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold uppercase tracking-wider">
            Driver Feedback History
          </span>
          <h2 className="text-2xl font-extrabold text-navy-900 font-sans">Ratings & Submitted Driver Reviews</h2>
        </div>

        {loading ? (
          <div className="h-48 bg-slate-200 animate-pulse rounded-3xl"></div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-soft space-y-2">
            <Star className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-extrabold text-navy-900">No Driver Reviews Submitted Yet</h4>
            <p className="text-xs text-slate-500">
              When a shipment status reaches Completed, you can process payment and leave a rating for the driver.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((r) => (
              <div key={r._id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                    ))}
                    <span className="text-xs font-bold text-navy-900 ml-1">{r.rating}.0 Stars</span>
                  </div>
                  <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">
                    {r.deliveryRoute}
                  </span>
                </div>
                <p className="text-slate-700 text-xs font-medium italic leading-relaxed">"{r.comment}"</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CompanyReviews;
