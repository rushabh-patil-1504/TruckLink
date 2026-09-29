import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building, Globe, CheckCircle } from 'lucide-react';
import API from '../../services/api';
import { GUJARAT_CITIES } from '../../utils/constants';

const PlacesWeServe = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await API.get('/service-locations');
        setLocations(res.data);
      } catch (err) {
        console.error('[Fetch Locations Error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const filteredLocations = locations.filter((loc) => {
    const matchesRegion =
      regionFilter === 'ALL' || loc.region === regionFilter;
    const matchesSearch =
      loc.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <section id="places" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-14">
          <span className="px-3.5 py-1.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-extrabold uppercase tracking-wider border border-brand-500/30">
            Network Coverage
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-sans">
            Places We Serve Across Gujarat & India
          </h2>
          <p className="text-slate-300 font-medium text-base">
            Connecting industrial hubs, ports, textile markets, and commercial zones in all major Gujarat districts and Indian metros.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-800/80 p-4 sm:p-6 rounded-3xl border border-slate-700/80 mb-12 shadow-2xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Region Tabs */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-700 w-full md:w-auto">
            <button
              onClick={() => setRegionFilter('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                regionFilter === 'ALL'
                  ? 'bg-brand-500 text-white shadow-brand'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Locations ({locations.length})
            </button>
            <button
              onClick={() => setRegionFilter('GUJARAT')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                regionFilter === 'GUJARAT'
                  ? 'bg-brand-500 text-white shadow-brand'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Gujarat State ({locations.filter(l => l.region === 'GUJARAT').length})
            </button>
            <button
              onClick={() => setRegionFilter('REST_OF_INDIA')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                regionFilter === 'REST_OF_INDIA'
                  ? 'bg-brand-500 text-white shadow-brand'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Rest of India
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search city (e.g. Surat, Vadodara)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

        </div>

        {/* City Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredLocations.map((loc) => (
              <div
                key={loc._id || loc.cityName}
                className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-brand-500/80 hover:bg-slate-800 transition-all group flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                    <h4 className="font-extrabold text-base text-white font-sans group-hover:text-brand-300 transition-colors">
                      {loc.cityName}
                    </h4>
                  </div>
                  {loc.isHub && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      HUB
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{loc.state}</span>
                  <span className="text-slate-500 text-[11px] font-medium">Service Area</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default PlacesWeServe;
