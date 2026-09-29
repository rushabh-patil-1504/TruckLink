import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, PlusCircle, Package, Navigation, CreditCard, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import CompanyHeader from '../../components/company/CompanyHeader';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import API from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

const CompanyDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/companies/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('[Company Dashboard Error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <CompanyHeader />
        <div className="max-w-7xl mx-auto px-4 py-12 flex-grow">
          <div className="h-64 bg-slate-200 animate-pulse rounded-3xl"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <CompanyHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow space-y-8">
        
        {/* Quick Dispatch CTA Bar */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-navy-900 to-navy-800 text-white shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Fast Freight Match</span>
            <h2 className="text-2xl font-extrabold font-sans">
              Need a Truck Dispatched Immediately?
            </h2>
            <p className="text-xs text-slate-300 font-medium">
              Browse {data?.availableDriversCount || 10}+ verified drivers currently available across Gujarat routes.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link to="/company/create-booking" className="w-full md:w-auto">
              <Button variant="primary" size="lg" icon={PlusCircle} className="w-full">
                Book a Truck Now
              </Button>
            </Link>
            <Link to="/company/drivers" className="w-full md:w-auto">
              <Button variant="outline" size="lg" className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20">
                Browse Available Fleet
              </Button>
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Available Drivers</span>
            <p className="text-3xl font-black text-brand-500 font-mono">{data?.availableDriversCount || 0}</p>
            <Link to="/company/drivers" className="text-xs font-bold text-navy-900 hover:underline inline-block">
              View available fleet →
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Shipments</span>
            <p className="text-3xl font-black text-navy-900 font-mono">{data?.activeBookingsCount || 0}</p>
            <Link to="/company/deliveries" className="text-xs font-bold text-navy-900 hover:underline inline-block">
              Track checkpoints →
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pending Requests</span>
            <p className="text-3xl font-black text-amber-600 font-mono">{data?.pendingRequestsCount || 0}</p>
            <span className="text-xs text-slate-400 font-medium">Awaiting driver accept</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Completed Orders</span>
            <p className="text-3xl font-black text-emerald-600 font-mono">{data?.completedBookingsCount || 0}</p>
            <span className="text-xs text-slate-400 font-medium">Verified deliveries</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Freight Spent</span>
            <p className="text-2xl font-black text-navy-900 font-mono">{formatCurrency(data?.totalSpent || 0)}</p>
            <span className="text-xs text-slate-400 font-medium">DEMO Transactions</span>
          </div>

        </div>

        {/* Active Bookings Summary List */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-navy-900 font-sans flex items-center gap-2">
              <Navigation className="w-5 h-5 text-brand-500" />
              <span>Active Shipments & Checkpoint Progress</span>
            </h3>
            <Link to="/company/deliveries" className="text-xs font-bold text-brand-600 hover:underline">
              View full checkpoint timeline →
            </Link>
          </div>

          {data?.activeBookings?.length === 0 ? (
            <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold">No active shipments in transit currently.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data?.activeBookings?.map((b) => (
                <div
                  key={b._id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 font-mono">#{b.bookingNumber}</span>
                      <Badge status={b.status} />
                    </div>
                    <h4 className="text-base font-extrabold text-navy-900 font-sans">
                      {b.pickupLocation} → {b.destinationLocation}
                    </h4>
                    <p className="text-xs text-slate-600 font-medium">
                      Driver: <strong className="text-navy-900">{b.driver?.name}</strong> • Cargo: {b.materialType} ({b.weightTons} Tons)
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link to="/company/deliveries">
                      <Button variant="secondary" size="sm" icon={Navigation}>
                        Monitor Checkpoints
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default CompanyDashboard;
