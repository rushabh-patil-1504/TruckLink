import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, Truck, MapPin, Calendar, CheckCircle2, ShieldCheck, ArrowRight, Eye, PlusCircle } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import CompanyHeader from '../../components/company/CompanyHeader';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import API from '../../services/api';
import { GUJARAT_CITIES, TRUCK_TYPES, MATERIAL_TYPES } from '../../utils/constants';

const AvailableDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [truckType, setTruckType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [minRating, setMinRating] = useState('');

  // Selected Driver for Profile Modal
  const [selectedDriver, setSelectedDriver] = useState(null);

  const navigate = useNavigate();

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (origin) params.origin = origin;
      if (destination) params.destination = destination;
      if (truckType) params.truckType = truckType;
      if (capacity) params.capacity = capacity;
      if (minRating) params.minRating = minRating;

      const res = await API.get('/companies/available-drivers', { params });
      setDrivers(res.data);
    } catch (err) {
      console.error('[Fetch Available Drivers Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [search, origin, destination, truckType, capacity, minRating]);

  const handleRequestBooking = (driver) => {
    navigate(`/company/create-booking?driverId=${driver.user._id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <CompanyHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow space-y-8">
        
        {/* Header Title */}
        <div className="space-y-2">
          <span className="px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-700 text-xs font-extrabold uppercase tracking-wider">
            Real-time Fleet Availability
          </span>
          <h2 className="text-3xl font-extrabold text-navy-900 font-sans">
            Available Fleet & Driver Directory
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Find and request verified truck drivers who have explicitly published available capacity across Gujarat & Indian routes.
          </p>
        </div>

        {/* Search & Multi-Filter Control Panel */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-soft space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Search Box */}
            <div className="md:col-span-2 relative">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search driver name, base city, or truck number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Origin City */}
            <div>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
              >
                <option value="">All Pickup Cities</option>
                {GUJARAT_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Destination City */}
            <div>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
              >
                <option value="">All Destination Cities</option>
                {GUJARAT_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Truck Type</label>
              <select
                value={truckType}
                onChange={(e) => setTruckType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
              >
                <option value="">All Truck Types</option>
                {TRUCK_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Min Capacity (Tons)</label>
              <input
                type="number"
                placeholder="e.g. 10"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Min Driver Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
              >
                <option value="">All Ratings</option>
                <option value="4.8">4.8+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
              </select>
            </div>
          </div>

        </div>

        {/* Driver Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-3xl"></div>
            ))}
          </div>
        ) : drivers.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-soft space-y-3">
            <Truck className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-lg font-extrabold text-navy-900">No Drivers Available For This Filter</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No truck drivers are currently available matching your exact city or capacity criteria. Try clearing filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.map((dp) => {
              const route = dp.currentRoute || {};
              const truck = dp.truck || {};
              return (
                <div
                  key={dp._id}
                  className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft hover:shadow-card hover:border-brand-400 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4">
                    {/* Header line */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-navy-900 text-white font-extrabold text-lg flex items-center justify-center">
                          {dp.user?.name?.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-navy-900 font-sans leading-tight">
                            {dp.user?.name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 mt-0.5">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{dp.rating || 5.0}</span>
                            <span className="text-slate-400 font-normal">({dp.completedDeliveries || 0} trips)</span>
                          </div>
                        </div>
                      </div>

                      <Badge status={dp.availabilityStatus} />
                    </div>

                    {/* Route banner */}
                    <div className="p-3.5 rounded-2xl bg-brand-50/70 border border-brand-200 space-y-1">
                      <div className="flex items-center justify-between text-xs font-extrabold text-brand-900">
                        <span>{route.origin || dp.baseCity} → {route.destination || 'Open Destination'}</span>
                        <span className="text-[10px] text-brand-600 bg-white px-2 py-0.5 rounded-full shadow-xs">
                          {truck.capacityTons || 10} Tons
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-700 font-medium">
                        Cargo: {route.materialType || 'General Freight'}
                      </p>
                    </div>

                    {/* Truck Details */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600">
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase">Truck Specs</span>
                        <span className="font-bold text-navy-900">{truck.truckType || 'Medium Truck'}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase">Vehicle No.</span>
                        <span className="font-bold text-navy-900 font-mono">{truck.truckNumber || 'GJ-05-AB-1234'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Eye}
                      onClick={() => setSelectedDriver(dp)}
                    >
                      View Profile
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={PlusCircle}
                      onClick={() => handleRequestBooking(dp)}
                    >
                      Request Booking
                    </Button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Driver Full Profile Modal */}
      {selectedDriver && (
        <Modal
          isOpen={!!selectedDriver}
          onClose={() => setSelectedDriver(null)}
          title={`Driver Profile: ${selectedDriver.user?.name}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-navy-900 text-white font-black text-2xl flex items-center justify-center">
                {selectedDriver.user?.name?.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-navy-900">{selectedDriver.user?.name}</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedDriver.experienceYears || 5} Years Experience • Base: {selectedDriver.baseCity}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-500 mt-1">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{selectedDriver.rating || 5.0} Rating ({selectedDriver.completedDeliveries || 0} completed shipments)</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Truck Specifications</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><strong>Truck Number:</strong> {selectedDriver.truck?.truckNumber}</div>
                <div><strong>Truck Type:</strong> {selectedDriver.truck?.truckType}</div>
                <div><strong>Capacity:</strong> {selectedDriver.truck?.capacityTons} Tons</div>
                <div><strong>Registration:</strong> {selectedDriver.truck?.registrationNumber}</div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <Button variant="outline" onClick={() => setSelectedDriver(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                icon={PlusCircle}
                onClick={() => {
                  const d = selectedDriver;
                  setSelectedDriver(null);
                  handleRequestBooking(d);
                }}
              >
                Request Booking Now
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <Footer />
    </div>
  );
};

export default AvailableDrivers;
