import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, CreditCard, Star, Navigation, Clock, Building2, Truck, CheckCircle2 } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import CompanyHeader from '../../components/company/CompanyHeader';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import DemoPaymentModal from '../../components/shared/DemoPaymentModal';
import ReviewModal from '../../components/shared/ReviewModal';
import API from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

const CompanyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  // Modals
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await API.get('/companies/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('[Company Bookings Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'PENDING') return b.status === 'PENDING';
    if (filter === 'ACTIVE') return ['ACCEPTED', 'CONFIRMED', 'ACTIVE'].includes(b.status);
    if (filter === 'COMPLETED') return b.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <CompanyHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-navy-900 font-sans">
              Company Freight Bookings
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Track status of placed orders, process demo payments, and rate driver performance.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            {['ALL', 'PENDING', 'ACTIVE', 'COMPLETED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === tab
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-3xl"></div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-soft space-y-3">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-extrabold text-navy-900">No Freight Orders Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't placed any bookings matching this category yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => (
              <div
                key={b._id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft hover:shadow-card transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-400">#{b.bookingNumber}</span>
                    <h3 className="text-lg font-extrabold text-navy-900 font-sans">
                      {b.pickupLocation} → {b.destinationLocation}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge status={b.paymentStatus === 'SUCCESS' ? 'SUCCESS' : b.status} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium text-slate-600">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-brand-500 shrink-0" />
                    <div>
                      <span className="block text-slate-400 text-[10px] uppercase">Assigned Driver</span>
                      <span className="font-extrabold text-navy-900">{b.driver?.name} ({b.driverProfile?.rating || 5.0} ★)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-brand-500 shrink-0" />
                    <div>
                      <span className="block text-slate-400 text-[10px] uppercase">Cargo & Load</span>
                      <span className="font-extrabold text-navy-900">{b.materialType} ({b.weightTons} Tons)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-500 shrink-0" />
                    <div>
                      <span className="block text-slate-400 text-[10px] uppercase">Pickup Date</span>
                      <span className="font-extrabold text-navy-900">{formatDate(b.pickupDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div>
                      <span className="block text-slate-400 text-[10px] uppercase">Total Rate</span>
                      <span className="font-black text-emerald-600 text-sm">{formatCurrency(b.price)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Toolbar */}
                <div className="pt-2 flex items-center justify-between gap-4 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 italic">
                    Vehicle: {b.truck?.truckNumber || 'Assigned Medium Truck'}
                  </span>

                  <div className="flex items-center gap-2">
                    {['CONFIRMED', 'ACTIVE'].includes(b.status) && (
                      <Link to="/company/deliveries">
                        <Button variant="secondary" size="sm" icon={Navigation}>
                          View Live Checkpoints
                        </Button>
                      </Link>
                    )}

                    {b.status === 'COMPLETED' && b.paymentStatus !== 'SUCCESS' && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={CreditCard}
                        onClick={() => setPaymentBooking(b)}
                      >
                        Process Demo Payment
                      </Button>
                    )}

                    {b.status === 'COMPLETED' && b.paymentStatus === 'SUCCESS' && !b.review && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Star}
                        onClick={() => setReviewBooking(b)}
                      >
                        Rate & Review Driver
                      </Button>
                    )}

                    {b.review && (
                      <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Reviewed
                      </span>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      {/* Demo Payment Modal */}
      {paymentBooking && (
        <DemoPaymentModal
          booking={paymentBooking}
          onClose={() => setPaymentBooking(null)}
          onSuccess={() => {
            setPaymentBooking(null);
            fetchBookings();
          }}
        />
      )}

      {/* Review Submission Modal */}
      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onSuccess={() => {
            setReviewBooking(null);
            fetchBookings();
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default CompanyBookings;
