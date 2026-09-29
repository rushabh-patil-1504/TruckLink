import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Truck, Building2, User, Mail, Lock, Phone, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { TRUCK_TYPES, MATERIAL_TYPES, GUJARAT_CITIES } from '../../utils/constants';

const Signup = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'company' ? 'COMPANY' : 'DRIVER';
  
  const [role, setRole] = useState(initialRole);
  const { register } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Common Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');

  // Driver Specific Fields
  const [truckNumber, setTruckNumber] = useState('GJ-05-AB-9988');
  const [registrationNumber, setRegistrationNumber] = useState('IND-981245');
  const [truckType, setTruckType] = useState('Medium Truck');
  const [capacityTons, setCapacityTons] = useState(15);
  const [experienceYears, setExperienceYears] = useState(5);
  const [baseCity, setBaseCity] = useState('Surat');
  const [preferredRoutes, setPreferredRoutes] = useState('Surat - Mumbai');
  const [materialTypesAccepted, setMaterialTypesAccepted] = useState('Textiles, General Cargo');
  const [availabilityStatus, setAvailabilityStatus] = useState('AVAILABLE');

  // Company Specific Fields
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [businessType, setBusinessType] = useState('Manufacturer');
  const [gstNumber, setGstNumber] = useState('24AAAAA0000A1Z5');
  const [companyAddress, setCompanyAddress] = useState('');
  const [city, setCity] = useState('Surat');
  const [state, setState] = useState('Gujarat');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        role,
        name: role === 'COMPANY' ? contactPerson || name : name,
        email,
        password,
        mobile,
        ...(role === 'DRIVER'
          ? {
              truckNumber,
              registrationNumber,
              truckType,
              capacityTons: parseFloat(capacityTons),
              experienceYears: parseFloat(experienceYears),
              baseCity,
              preferredRoutes: preferredRoutes.split(',').map((s) => s.trim()),
              materialTypesAccepted: materialTypesAccepted.split(',').map((s) => s.trim()),
              availabilityStatus
            }
          : {
              companyName,
              contactPerson,
              businessType,
              gstNumber,
              companyAddress,
              city,
              state
            })
      };

      const user = await register(payload);
      if (user.activeRole === 'DRIVER') {
        navigate('/driver/dashboard');
      } else {
        navigate('/company/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center space-y-3">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold shadow-brand">
            <Truck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-3xl font-extrabold text-navy-900 font-sans tracking-tight">
            Truck<span className="text-brand-500">Link</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-navy-900 font-sans">
          Create Your TruckLink Account
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Join the freight logistics network connecting truck drivers and businesses.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-card rounded-3xl border border-slate-200">
          
          {/* Role Choice Selector */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl mb-8 border border-slate-200">
            <button
              type="button"
              onClick={() => setRole('DRIVER')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-extrabold text-sm transition-all ${
                role === 'DRIVER'
                  ? 'bg-brand-500 text-white shadow-brand'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Truck Driver / Owner</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('COMPANY')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-extrabold text-sm transition-all ${
                role === 'COMPANY'
                  ? 'bg-brand-500 text-white shadow-brand'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Company / Business Owner</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Common Fields */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    {role === 'DRIVER' ? 'Full Name' : 'Contact Person Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Patel"
                    value={role === 'DRIVER' ? name : contactPerson}
                    onChange={(e) => {
                      setName(e.target.value);
                      setContactPerson(e.target.value);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Role Specific Registration Fields */}
            {role === 'DRIVER' ? (
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vehicle & Driver Details</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Truck Number</label>
                    <input
                      type="text"
                      required
                      value={truckNumber}
                      onChange={(e) => setTruckNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Truck Type</label>
                    <select
                      value={truckType}
                      onChange={(e) => setTruckType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                    >
                      {TRUCK_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Capacity (Tons)</label>
                    <input
                      type="number"
                      required
                      value={capacityTons}
                      onChange={(e) => setCapacityTons(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Base City</label>
                    <select
                      value={baseCity}
                      onChange={(e) => setBaseCity(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                    >
                      {GUJARAT_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      required
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Initial Availability</label>
                    <select
                      value={availabilityStatus}
                      onChange={(e) => setAvailabilityStatus(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="BUSY">BUSY</option>
                      <option value="OFFLINE">OFFLINE</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Preferred Routes (Comma Separated)</label>
                  <input
                    type="text"
                    value={preferredRoutes}
                    onChange={(e) => setPreferredRoutes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company Details</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ABC Textiles Pvt Ltd"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Business Type</label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="Manufacturer">Manufacturer</option>
                      <option value="Distributor">Distributor</option>
                      <option value="Retailer">Retailer</option>
                      <option value="Wholesaler">Wholesaler</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">GST Number (Optional)</label>
                    <input
                      type="text"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">City</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                    >
                      {GUJARAT_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" loading={loading} icon={ArrowRight} className="w-full">
              Complete {role === 'DRIVER' ? 'Driver' : 'Company'} Registration
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:underline">
              Log in here
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;
