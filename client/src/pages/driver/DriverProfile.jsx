import React, { useState, useEffect } from 'react';
import { User, Truck, Star, MapPin, Award, ShieldCheck, Route, Calendar } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import DriverHeader from '../../components/driver/DriverHeader';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { formatDate } from '../../utils/formatters';

const DriverProfile = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);

  const driverProfile = user?.driverProfile || {};
  const truck = driverProfile.truck || {};

  useEffect(() => {
    if (user?._id) {
      API.get(`/reviews/driver/${user._id}`)
        .then((res) => setReviews(res.data))
        .catch((err) => console.error('[Reviews Error]', err));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <DriverHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow space-y-8 w-full">
        
        {/* Profile Header */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-navy-900 text-white font-black text-2xl flex items-center justify-center shadow-card">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold text-navy-900 font-sans">{user?.name}</h2>
                <Badge status={driverProfile.availabilityStatus || 'AVAILABLE'} />
              </div>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Verified Freight Driver • Base: {driverProfile.baseCity || 'Surat'}
              </p>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-600 mt-2">
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {driverProfile.rating || 5.0} Average Rating ({driverProfile.totalReviews || reviews.length} Reviews)
                </span>
                <span>•</span>
                <span>{driverProfile.completedDeliveries || 0} Deliveries Completed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Truck Details */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-5">
            <h3 className="text-lg font-extrabold text-navy-900 font-sans flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-500" />
              <span>Vehicle & Capacity Specs</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-600">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-slate-400 text-[10px] uppercase font-bold">Truck Number</span>
                <span className="text-base font-extrabold text-navy-900 font-mono">{truck.truckNumber || 'GJ-05-AB-1234'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-slate-400 text-[10px] uppercase font-bold">Registration No.</span>
                <span className="text-base font-extrabold text-navy-900 font-mono">{truck.registrationNumber || 'IND-981245'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-slate-400 text-[10px] uppercase font-bold">Vehicle Type</span>
                <span className="text-sm font-bold text-navy-900">{truck.truckType || 'Medium Truck'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-slate-400 text-[10px] uppercase font-bold">Max Capacity</span>
                <span className="text-sm font-bold text-brand-600">{truck.capacityTons || 15} Tons</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Preferred Operating Routes</span>
              <div className="flex flex-wrap gap-2">
                {driverProfile.preferredRoutes?.map((r, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-brand-50 text-brand-700 text-xs font-bold">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Client Reviews */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-5">
            <h3 className="text-lg font-extrabold text-navy-900 font-sans flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>Verified Client Reviews</span>
            </h3>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No reviews submitted yet for this profile.</p>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {reviews.map((r) => (
                  <div key={r._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-navy-900">{r.companyName}</span>
                      <span className="text-xs font-bold text-amber-500">★ {r.rating}.0</span>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{r.comment}"</p>
                    <span className="text-[10px] font-bold text-brand-600 block">{r.deliveryRoute}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default DriverProfile;
