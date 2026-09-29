import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, CalendarCheck, Package, Navigation, Star, ArrowRight, Clock, ShieldCheck, MapPin } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import DriverHeader from '../../components/driver/DriverHeader';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import API from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

const DriverDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/drivers/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('[Driver Dashboard Error]', err);
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
        <DriverHeader />
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
      <DriverHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow space-y-8">
        
        {/* Top Availability Alert Bar */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Availability</span>
                <Badge status={data?.availabilityStatus} />
              </div>
              <h3 className="text-lg font-extrabold text-navy-900 font-sans mt-0.5">
                {data?.currentRoute?.origin ? `${data.currentRoute.origin} → ${data.currentRoute.destination}` : 'Base City Ready'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Max Load: {data?.currentRoute?.maxWeightTons || data?.truck?.capacityTons || 10} Tons • Vehicle: {data?.truck?.truckNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link to="/driver/availability" className="w-full md:w-auto">
              <Button variant="primary" icon={CalendarCheck} className="w-full">
                Update Route Availability
              </Button>
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Requests</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-3xl font-black text-navy-900 font-mono">{data?.pendingBookings || 0}</p>
            <Link to="/driver/requests" className="text-xs font-bold text-brand-600 hover:underline inline-block">
              Review requests →
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Completed Trips</span>
              <Package className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-3xl font-black text-navy-900 font-mono">{data?.completedDeliveries || 0}</p>
            <span className="text-xs text-slate-500 font-medium">Total verified freight</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Driver Rating</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-3xl font-black text-navy-900 font-mono">{data?.rating || 5.0} ★</p>
            <span className="text-xs text-slate-500 font-medium">From verified company reviews</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Truck Capacity</span>
              <Truck className="w-4 h-4 text-brand-500" />
            </div>
            <p className="text-3xl font-black text-navy-900 font-mono">{data?.truck?.capacityTons || 15} Tons</p>
            <span className="text-xs text-slate-500 font-medium">{data?.truck?.truckType || 'Medium Truck'}</span>
          </div>

        </div>

        {/* Active Delivery Highlight Banner */}
        {data?.activeBooking ? (
          <div className="p-8 rounded-3xl bg-navy-900 text-white shadow-card space-y-6">
            <div className="flex items-center justify-between border-b border-navy-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">ACTIVE SHIPMENT IN TRANSIT</span>
              </div>
              <Badge status={data.activeBooking.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Route</p>
                <p className="text-xl font-extrabold font-sans mt-1">
                  {data.activeBooking.pickupLocation} → {data.activeBooking.destinationLocation}
                </p>
                <p className="text-xs text-brand-400 font-semibold mt-1">
                  Cargo: {data.activeBooking.materialType} ({data.activeBooking.weightTons} Tons)
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Company Owner</p>
                <p className="text-base font-bold text-white mt-1">
                  {data.activeBooking.companyProfile?.companyName || 'Freight Client'}
                </p>
                <p className="text-xs text-slate-400">Booking #{data.activeBooking.bookingNumber}</p>
              </div>

              <div className="flex items-center justify-end">
                <Link to="/driver/delivery">
                  <Button variant="primary" size="lg" icon={Navigation}>
                    Update Checkpoints
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-navy-900">No Active Shipment Currently</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                You are ready to accept new booking requests from companies across your preferred routes.
              </p>
            </div>
            <Link to="/driver/availability">
              <Button variant="outline" size="sm">
                Set Trip Availability
              </Button>
            </Link>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default DriverDashboard;
