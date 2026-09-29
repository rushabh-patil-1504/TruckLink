import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, CheckCircle2, XCircle, Clock, MapPin, Building2, Calendar, Navigation } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import DriverHeader from '../../components/driver/DriverHeader';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import API from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

const DriverBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await API.get('/drivers/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('[Driver Bookings Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleRespond = async (bookingId, action) => {
    setActionLoadingId(bookingId);
    try {
      await API.put(`/drivers/bookings/${bookingId}/respond`, { action });
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'PENDING') return b.status === 'PENDING';
    if (filter === 'ACTIVE') return ['ACCEPTED', 'CONFIRMED', 'ACTIVE'].includes(b.status);
    if (filter === 'COMPLETED') return b.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <DriverHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow space-y-6">
        
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-navy-900 font-sans">
              Freight Booking Requests
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Review company booking inquiries and manage confirmed shipment orders.
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

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-3xl"></div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-soft space-y-3">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-extrabold text-navy-900">No Bookings Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are currently no booking requests under this filter category.
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
                  <Badge status={b.status} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium text-slate-600">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-brand-500 shrink-0" />
                    <div>
                      <span className="block text-slate-400 text-[10px] uppercase">Company Client</span>
                      <span className="font-extrabold text-navy-900">{b.companyProfile?.companyName || b.company?.name}</span>
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
                    <Calendar className="w-4 h-4 text-brand-500 shrink-0" />
                    <div>
                      <span className="block text-slate-400 text-[10px] uppercase">Pickup Date</span>
                      <span className="font-extrabold text-navy-900">{formatDate(b.pickupDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div>
                      <span className="block text-slate-400 text-[10px] uppercase">Agreed Freight Fee</span>
                      <span className="font-black text-emerald-600 text-sm">{formatCurrency(b.price)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-between gap-4">
                  <span className="text-[11px] text-slate-400 italic">
                    {b.specialInstructions ? `Note: "${b.specialInstructions}"` : 'No special handling noted'}
                  </span>

                  {b.status === 'PENDING' ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="danger"
                        size="sm"
                        loading={actionLoadingId === b._id}
                        onClick={() => handleRespond(b._id, 'REJECT')}
                        icon={XCircle}
                      >
                        Decline
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        loading={actionLoadingId === b._id}
                        onClick={() => handleRespond(b._id, 'ACCEPT')}
                        icon={CheckCircle2}
                      >
                        Accept Booking
                      </Button>
                    </div>
                  ) : ['CONFIRMED', 'ACTIVE'].includes(b.status) ? (
                    <Link to="/driver/delivery">
                      <Button variant="secondary" size="sm" icon={Navigation}>
                        Go to Checkpoints Tracker
                      </Button>
                    </Link>
                  ) : null}
                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default DriverBookings;
