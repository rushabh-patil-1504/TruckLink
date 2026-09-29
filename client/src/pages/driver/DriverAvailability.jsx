import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, MapPin, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import DriverHeader from '../../components/driver/DriverHeader';
import Button from '../../components/common/Button';
import API from '../../services/api';
import { GUJARAT_CITIES, TRUCK_TYPES, MATERIAL_TYPES } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

const DriverAvailability = () => {
  const { user, updateLocalUser } = useAuth();
  const navigate = useNavigate();

  const driverProfile = user?.driverProfile || {};
  const currentRoute = driverProfile.currentRoute || {};

  const [originCity, setOriginCity] = useState(currentRoute.origin || 'Surat');
  const [destinationCity, setDestinationCity] = useState(currentRoute.destination || 'Mumbai');
  const [availableFrom, setAvailableFrom] = useState(new Date().toISOString().split('T')[0]);
  const [availableUntil, setAvailableUntil] = useState(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
  const [materialType, setMaterialType] = useState('Textiles & Garments');
  const [maxWeightTons, setMaxWeightTons] = useState(driverProfile.truck?.capacityTons || 15);
  const [truckType, setTruckType] = useState(driverProfile.truck?.truckType || 'Medium Truck');
  const [notes, setNotes] = useState('Ready for immediate loading & dispatch.');
  const [availabilityStatus, setAvailabilityStatus] = useState(driverProfile.availabilityStatus || 'AVAILABLE');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload = {
        originCity,
        destinationCity,
        availableFrom,
        availableUntil,
        materialTypes: [materialType],
        maxWeightTons: parseFloat(maxWeightTons),
        truckType,
        notes,
        availabilityStatus
      };

      const res = await API.post('/drivers/availability', payload);
      setSuccessMsg('Your fleet availability has been published live in MongoDB and broadcast to companies!');

      // Update auth context user
      if (res.data.driverProfile && user) {
        updateLocalUser({
          ...user,
          driverProfile: res.data.driverProfile
        });
      }

      setTimeout(() => {
        navigate('/driver/dashboard');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update availability');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <DriverHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-card border border-slate-200 space-y-8">
          
          <div className="space-y-2">
            <span className="px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-700 text-xs font-extrabold uppercase tracking-wider">
              Fleet Capacity Manager
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-sans">
              Set Truck & Route Availability
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Announce your truck route to companies searching for freight transport across Gujarat and India.
            </p>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Status Radio */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                Availability Status
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['AVAILABLE', 'BUSY', 'OFFLINE'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setAvailabilityStatus(st)}
                    className={`py-3 rounded-2xl font-extrabold text-xs border transition-all ${
                      availabilityStatus === st
                        ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Route origin & destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                  Delivery From (Origin City)
                </label>
                <select
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 font-semibold"
                >
                  {GUJARAT_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                  Delivery To (Destination City)
                </label>
                <select
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 font-semibold"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                  Available Date
                </label>
                <input
                  type="date"
                  required
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                  Available Until
                </label>
                <input
                  type="date"
                  required
                  value={availableUntil}
                  onChange={(e) => setAvailableUntil(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 font-semibold"
                />
              </div>
            </div>

            {/* Capacity & Truck details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                  Material Type
                </label>
                <select
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 font-semibold"
                >
                  {MATERIAL_TYPES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                  Maximum Weight (Tons)
                </label>
                <input
                  type="number"
                  required
                  value={maxWeightTons}
                  onChange={(e) => setMaxWeightTons(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                  Truck Type
                </label>
                <select
                  value={truckType}
                  onChange={(e) => setTruckType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 font-semibold"
                >
                  {TRUCK_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                Additional Route & Service Notes
              </label>
              <textarea
                rows="3"
                placeholder="e.g. Return trip from Surat textile market. Fast loading guaranteed."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
              ></textarea>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} icon={CalendarCheck} className="w-full">
              Publish Route Availability Live
            </Button>
          </form>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default DriverAvailability;
