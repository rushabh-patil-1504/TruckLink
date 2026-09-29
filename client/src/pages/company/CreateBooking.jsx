import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PlusCircle, Calculator, MapPin, Calendar, Truck, Package, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import CompanyHeader from '../../components/company/CompanyHeader';
import Button from '../../components/common/Button';
import API from '../../services/api';
import { GUJARAT_CITIES, TRUCK_TYPES, MATERIAL_TYPES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

const CreateBooking = () => {
  const [searchParams] = useSearchParams();
  const preselectedDriverId = searchParams.get('driverId') || '';

  const navigate = useNavigate();

  const [drivers, setDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState(preselectedDriverId);

  // Form Fields
  const [pickupLocation, setPickupLocation] = useState('Surat');
  const [destinationLocation, setDestinationLocation] = useState('Mumbai');
  const [pickupDate, setPickupDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
  const [materialType, setMaterialType] = useState('Textiles & Garments');
  const [weightTons, setWeightTons] = useState(15);
  const [truckType, setTruckType] = useState('Medium Truck');
  const [specialInstructions, setSpecialInstructions] = useState('Keep dry. Secure fabric rolls tightly.');

  // Pricing State
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch Drivers list for dropdown
  useEffect(() => {
    API.get('/companies/available-drivers')
      .then((res) => setDrivers(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Recalculate demo price on input change
  useEffect(() => {
    const fetchEstimate = async () => {
      try {
        const res = await API.post('/bookings/estimate-price', {
          pickupLocation,
          destinationLocation,
          weightTons: parseFloat(weightTons) || 10,
          truckType,
          materialType
        });
        setPriceData(res.data);
      } catch (err) {
        console.error('[Estimate Error]', err);
      }
    };
    fetchEstimate();
  }, [pickupLocation, destinationLocation, weightTons, truckType, materialType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDriverId) {
      setErrorMsg('Please select a driver for this booking request.');
      return;
    }

    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload = {
        driverId: selectedDriverId,
        pickupLocation,
        destinationLocation,
        pickupDate,
        expectedDeliveryDate,
        materialType,
        weightTons: parseFloat(weightTons),
        truckType,
        specialInstructions
      };

      const res = await API.post('/bookings', payload);
      setSuccessMsg('Booking request placed! Notification sent to driver in real-time via Socket.IO.');
      setTimeout(() => {
        navigate('/company/bookings');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit booking request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <CompanyHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Side */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 shadow-card border border-slate-200 space-y-6">
            
            <div className="space-y-1">
              <span className="px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-700 text-xs font-extrabold uppercase tracking-wider">
                Order Freight Transport
              </span>
              <h2 className="text-2xl font-extrabold text-navy-900 font-sans">
                Book a Truck Request
              </h2>
            </div>

            {successMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Preferred Driver Dropdown */}
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                  Select Preferred Driver / Truck
                </label>
                <select
                  required
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">-- Choose an Available Driver --</option>
                  {drivers.map((d) => (
                    <option key={d.user._id} value={d.user._id}>
                      {d.user?.name} (★ {d.rating || 5.0}) • {d.truck?.truckType} ({d.truck?.capacityTons}T) • Route: {d.currentRoute?.origin || d.baseCity} → {d.currentRoute?.destination || 'Open'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pickup & Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Pickup Location
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
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
                    Destination Location
                  </label>
                  <select
                    value={destinationLocation}
                    onChange={(e) => setDestinationLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                  >
                    {GUJARAT_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Expected Delivery Date
                  </label>
                  <input
                    type="date"
                    required
                    value={expectedDeliveryDate}
                    onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Cargo Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Material Type
                  </label>
                  <select
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    {MATERIAL_TYPES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Weight (Tons)
                  </label>
                  <input
                    type="number"
                    required
                    value={weightTons}
                    onChange={(e) => setWeightTons(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Truck Type Required
                  </label>
                  <select
                    value={truckType}
                    onChange={(e) => setTruckType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    {TRUCK_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                  Special Delivery Instructions
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Ensure tarpaulin cover is attached."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                ></textarea>
              </div>

              <Button type="submit" variant="primary" size="lg" loading={submitting} icon={PlusCircle} className="w-full">
                Submit Booking Request
              </Button>
            </form>

          </div>

          {/* Pricing Estimation Breakdown Sidebar */}
          <div className="lg:col-span-5 bg-navy-900 text-white rounded-3xl p-8 shadow-card space-y-6">
            <div className="flex items-center justify-between border-b border-navy-800 pb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-brand-400" />
                <h3 className="text-lg font-extrabold font-sans">Freight Price Estimator</h3>
              </div>
              <span className="px-2.5 py-1 rounded bg-brand-500/20 text-brand-300 text-[10px] font-extrabold border border-brand-500/30">
                DEMO PRICING
              </span>
            </div>

            <div className="space-y-4">
              <div className="text-center p-6 rounded-2xl bg-navy-800 border border-navy-700 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Total Rate</span>
                <p className="text-4xl font-black text-brand-400 font-mono">
                  {formatCurrency(priceData?.estimatedPrice || 18500)}
                </p>
                <p className="text-[11px] text-slate-400 italic">Inclusive of fuel & driver fee</p>
              </div>

              <div className="space-y-2 text-xs text-slate-300 divide-y divide-navy-800">
                <div className="flex justify-between pt-2">
                  <span>Route Distance (Est.)</span>
                  <span className="font-bold text-white">{priceData?.breakdown?.estimatedDistanceKm || 280} Km</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span>Base Booking Fee</span>
                  <span className="font-bold text-white">{formatCurrency(priceData?.breakdown?.baseFare || 3500)}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span>Tonnage Charge ({weightTons} Tons)</span>
                  <span className="font-bold text-white">{formatCurrency(priceData?.breakdown?.tonnageCharge || 6750)}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span>Distance Fare Rate</span>
                  <span className="font-bold text-white">{formatCurrency(priceData?.breakdown?.distanceFare || 7840)}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-navy-800/80 border border-navy-700 text-[11px] text-slate-400 leading-relaxed">
                <Sparkles className="w-4 h-4 text-brand-400 inline mr-1" />
                <strong>Disclaimer:</strong> Prices are generated dynamically for demonstration based on distance, cargo weight, and truck type.
              </div>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default CreateBooking;
