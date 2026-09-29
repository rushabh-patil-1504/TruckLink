import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Plus, CheckCircle2, Clock, Truck, Building2, AlertCircle } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import DriverHeader from '../../components/driver/DriverHeader';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import API from '../../services/api';
import { formatDateTime } from '../../utils/formatters';
import { GUJARAT_CITIES } from '../../utils/constants';

const ActiveDelivery = () => {
  const [activeBooking, setActiveBooking] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  // Checkpoint Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [cityName, setCityName] = useState('Vadodara');
  const [note, setNote] = useState('Reached toll plaza. Vehicle & cargo in good condition.');
  const [isFinalDestination, setIsFinalDestination] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchActiveDelivery = async () => {
    try {
      const res = await API.get('/drivers/dashboard');
      if (res.data?.activeBooking) {
        setActiveBooking(res.data.activeBooking);
        const delRes = await API.get(`/deliveries/booking/${res.data.activeBooking._id}`);
        setDelivery(delRes.data);
      } else {
        setActiveBooking(null);
        setDelivery(null);
      }
    } catch (err) {
      console.error('[Fetch Active Delivery Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveDelivery();
  }, []);

  const handleAddCheckpoint = async (e) => {
    e.preventDefault();
    if (!delivery) return;

    setSubmitting(true);
    setErrorMsg('');

    try {
      await API.post(`/deliveries/${delivery._id}/checkpoint`, {
        cityName,
        note,
        isFinalDestination
      });

      setModalOpen(false);
      setNote('');
      fetchActiveDelivery();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to add checkpoint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <DriverHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow space-y-8 w-full">
        
        {loading ? (
          <div className="h-64 bg-slate-200 animate-pulse rounded-3xl"></div>
        ) : !activeBooking ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-soft space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Navigation className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-navy-900 font-sans">No Active Shipment in Transit</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              You do not have an active trip currently in progress. Accept an incoming request to start tracking checkpoints.
            </p>
          </div>
        ) : (
          <>
            {/* Header Box */}
            <div className="p-8 rounded-3xl bg-navy-900 text-white shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">ACTIVE DELIVERY IN PROGRESS</span>
                </div>
                <Badge status={delivery?.status || activeBooking.status} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Shipment Route</span>
                  <h2 className="text-2xl font-extrabold font-sans mt-1 text-white">
                    {activeBooking.pickupLocation} → {activeBooking.destinationLocation}
                  </h2>
                  <p className="text-xs text-brand-400 font-semibold mt-1">
                    Cargo: {activeBooking.materialType} ({activeBooking.weightTons} Tons)
                  </p>
                </div>

                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Client Company</span>
                  <p className="text-base font-bold text-white mt-1">
                    {activeBooking.companyProfile?.companyName || 'Freight Client'}
                  </p>
                  <p className="text-xs text-slate-400">Booking #{activeBooking.bookingNumber}</p>
                </div>

                <div className="flex items-center justify-end">
                  <Button variant="primary" size="lg" icon={Plus} onClick={() => setModalOpen(true)}>
                    Add Checkpoint Milestone
                  </Button>
                </div>
              </div>

              {/* GPS Disclaimer notice */}
              <div className="p-3.5 rounded-xl bg-navy-800/80 border border-navy-700 text-xs text-slate-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-brand-400 shrink-0" />
                <span>
                  <strong>Manual Checkpoints Enabled:</strong> Live GPS tracking is not currently enabled for this prototype. Please log milestone cities as you reach them.
                </span>
              </div>
            </div>

            {/* Checkpoint Progress Visual Timeline */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-6">
              <h3 className="text-lg font-extrabold text-navy-900 font-sans flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-500" />
                <span>Delivery Checkpoints Timeline</span>
              </h3>

              <div className="relative border-l-2 border-brand-500/30 pl-6 ml-3 space-y-8">
                {delivery?.checkpoints?.map((cp, index) => (
                  <div key={index} className="relative group">
                    
                    {/* Circle Node */}
                    <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs shadow-brand">
                      ✓
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-extrabold text-navy-900 font-sans">
                          {cp.cityName}
                        </h4>
                        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDateTime(cp.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        {cp.note || 'Milestone reached'}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </main>

      {/* Add Checkpoint Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Add Delivery Checkpoint"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleAddCheckpoint} className="space-y-4">
            
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                Checkpoint City
              </label>
              <select
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
              >
                {GUJARAT_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                Driver Note / Update
              </label>
              <textarea
                rows="3"
                placeholder="e.g. Crossed toll plaza. Rested for 20 mins."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              ></textarea>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="finalDest"
                checked={isFinalDestination}
                onChange={(e) => setIsFinalDestination(e.target.checked)}
                className="w-4 h-4 text-brand-500 rounded focus:ring-brand-500"
              />
              <label htmlFor="finalDest" className="text-xs font-bold text-navy-900">
                Mark as Final Destination Arrival (Completes Shipment)
              </label>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={submitting} icon={Plus}>
                Post Checkpoint Live
              </Button>
            </div>
          </form>
        </Modal>
      )}

      <Footer />
    </div>
  );
};

export default ActiveDelivery;
