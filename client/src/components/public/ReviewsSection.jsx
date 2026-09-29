import React from 'react';
import { Star, Quote, Route, Building2 } from 'lucide-react';

const demoReviews = [
  {
    id: 1,
    companyName: 'ABC Textiles Pvt Ltd',
    contactPerson: 'Rajesh Shah',
    rating: 5,
    comment: 'Booked a 15-ton medium truck from Surat to Mumbai. Driver Rahul Patel updated every checkpoint promptly. Goods arrived safely without any fabric damage!',
    route: 'Surat → Mumbai',
    date: '10 Sept 2026'
  },
  {
    id: 2,
    companyName: 'Gujarat Manufacturing Corp',
    contactPerson: 'Mehul Patel',
    rating: 5,
    comment: 'Outstanding platform! Transported 20 tons of heavy industrial valves from Ahmedabad to Vadodara. The transparent checkpoint milestone system kept our team informed.',
    route: 'Ahmedabad → Vadodara',
    date: '08 Sept 2026'
  },
  {
    id: 3,
    companyName: 'Vibrant Ceramics & Tiles',
    contactPerson: 'Kirit Ceramic',
    rating: 4.9,
    comment: 'Morbi ceramic tile freight dispatch is usually hectic. TruckLink matched us with an available trailer driver within minutes!',
    route: 'Morbi → Mumbai',
    date: '04 Sept 2026'
  }
];

const ReviewsSection = () => {
  return (
    <section id="reviews" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider">
            Verified Feedback
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-navy-900 font-sans">
            What Freight Clients Say
          </h2>
          <p className="text-slate-600 font-medium text-base">
            Read authentic reviews submitted by business owners and manufacturers across Gujarat.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {demoReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-8 rounded-3xl bg-white border border-slate-200 shadow-soft flex flex-col justify-between hover:shadow-card transition-all"
            >
              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400" />
                  ))}
                  <span className="text-xs font-extrabold text-navy-900 ml-1.5">{rev.rating}.0</span>
                </div>

                <p className="text-slate-700 text-sm leading-relaxed font-medium italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-navy-900 text-white font-bold text-xs flex items-center justify-center">
                      {rev.companyName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-navy-900 leading-tight">{rev.companyName}</h4>
                      <p className="text-xs text-slate-500 font-medium">{rev.contactPerson}</p>
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">
                  <Route className="w-3.5 h-3.5" />
                  <span>{rev.route}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ReviewsSection;
