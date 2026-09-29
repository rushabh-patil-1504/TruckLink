import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Clock, Truck, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import CompanyHeader from '../../components/company/CompanyHeader';
import Badge from '../../components/common/Badge';
import API from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { formatDateTime } from '../../utils/formatters';

const CompanyDeliveries = () => {
  const [activeBookings, setActiveBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  const { socket } = useSocket();

  const fetchActiveDeliveries = async () => {
    try {
      const res = await API.get('/companies/dashboard');
      if (res.data?.activeBookings?.length > 0) {
        setActiveBookings(res.data.activeBookings);
        const firstId = res.data.activeBookings[0]._id;
        setSelectedBookingId(firstId);
        fetchDeliveryDetails(firstId);
      } else {
        setActiveBookings([]);
        setDelivery(null);
      }
    } catch (err) {
      console.error('[Fetch Active Deliveries Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryDetails = async (bId) => {
    try {
      const res = await API.get(`/deliveries/booking/${bId}`);
      setDelivery(res.data);
    } catch (err) {
      console.error('[Delivery Details Error]', err);
    }
  };

  useEffect(() => {
    fetchActiveDeliveries();
  }, []);

  // Listen for real-time Checkpoint updates via Socket.IO
  useEffect(() => {
    if (!socket) return;

    const handleCheckpointAdded = (data) => {
      if (delivery && data.deliveryId === delivery._id) {
        setDelivery((prev) => ({
          ...prev,
          currentLocation: data.currentLocation,
          checkpoints: data.checkpoints,
          status: data.status
        }));
      }
    };

    socket.on('checkpoint_added', handleCheckpointAdded);

    return () => {
      socket.off('checkpoint_added', handleCheckpointAdded);
    };
  }, [socket, delivery]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <CompanyHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow space-y-8 w-full">
        
        {/* Header */}
        <div className="space-y-1">
          <span className="px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-700 text-xs font-extrabold uppercase tracking-wider">
            Live Delivery Visibility
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-sans">
            Shipment Checkpoints Monitor
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Monitor real-time manual transit milestones logged by your assigned drivers.
          </p>
        </div>

        {/* GPS Disclaimer notice */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            <strong>Manual Checkpoint Mode:</strong> Live GPS tracking is not currently enabled. Milestones below are manually posted by the truck driver in real-time.
          </span>
        </div>

        {loading ? (
          <div className="h-64 bg-slate-200 animate-pulse rounded-3xl"></div>
        ) : activeBookings.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-soft space-y-4">
            <Navigation className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-xl font-extrabold text-navy-900 font-sans">No Active Shipments in Transit</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              You currently have no active freight shipments on the road. Request an available driver to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Active Shipments Selector List */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
              <h3 className="text-sm font-extrabold text-navy-900 uppercase tracking-wider">Active Shipments</h3>
              <div className="space-y-2">
                {activeBookings.map((b) => (
                  <button
                    key={b._id}
                    onClick={() => {
                      setSelectedBookingId(b._id);
                      fetchDeliveryDetails(b._id);
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      selectedBookingId === b._id
                        ? 'bg-navy-900 text-white border-navy-900 shadow-md'
                        : 'bg-slate-50 text-navy-900 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono font-bold">#{b.bookingNumber}</span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-brand-500 text-white">
                        {b.status}
                      </span>
                    </div>
                    <p className="font-extrabold text-sm font-sans">{b.pickupLocation} → {b.destinationLocation}</p>
                    <p className="text-xs opacity-75 mt-1">Driver: {b.driver?.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Delivery Timeline Details */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6">
              {delivery ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Location</span>
                      <h3 className="text-2xl font-extrabold text-navy-900 font-sans mt-0.5 flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-brand-500" />
                        <span>{delivery.currentLocation}</span>
                      </h3>
                    </div>

                    <div className="text-left sm:text-right text-xs">
                      <span className="text-slate-400 font-bold block uppercase">Driver Details</span>
                      <span className="font-extrabold text-navy-900 text-sm">{delivery.booking?.driver?.name}</span>
                      <span className="block text-slate-500">Vehicle: {delivery.booking?.truck?.truckNumber}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-extrabold text-navy-900 uppercase tracking-wider">
                      Real-time Milestone Timeline
                    </h4>

                    <div className="relative border-l-2 border-brand-500/30 pl-6 ml-3 space-y-6">
                      {delivery.checkpoints?.map((cp, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                            ✓
                          </div>

                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                            <div className="flex items-center justify-between">
                              <h5 className="text-base font-extrabold text-navy-900 font-sans">{cp.cityName}</h5>
                              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {formatDateTime(cp.timestamp)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium">{cp.note || 'Reached milestone'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-slate-400">Select a shipment to inspect checkpoint progress.</div>
              )}
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default CompanyDeliveries;
