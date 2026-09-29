import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, Mail, Lock, ArrowRight, AlertCircle, Sparkles, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const user = await login(identifier, password);
      if (user.activeRole === 'DRIVER') {
        navigate('/driver/dashboard');
      } else {
        navigate('/company/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid login credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo Login Quick Fill Helpers
  const fillDemoDriver = () => {
    setIdentifier('rahul.driver@trucklink.com');
    setPassword('password123');
  };

  const fillDemoCompany = () => {
    setIdentifier('contact@abctextiles.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold shadow-brand">
            <Truck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-3xl font-extrabold text-navy-900 font-sans tracking-tight">
            Truck<span className="text-brand-500">Link</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-navy-900 font-sans">
          Log In to Operations Portal
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Enter your registered email or mobile number to continue.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-card rounded-3xl border border-slate-200 space-y-6">
          
          {/* Quick Demo Credentials Bar */}
          <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-brand-800">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Quick Demo 1-Click Fill:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillDemoDriver}
                className="px-3 py-2 bg-white text-navy-900 hover:bg-brand-500 hover:text-white border border-brand-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Demo Driver</span>
              </button>
              <button
                type="button"
                onClick={fillDemoCompany}
                className="px-3 py-2 bg-white text-navy-900 hover:bg-brand-500 hover:text-white border border-brand-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Demo Company</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                Email or Mobile Number
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="email@example.com or 9876543210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} icon={ArrowRight} className="w-full">
              Log In to Portal
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/auth" className="font-bold text-brand-600 hover:underline">
              Create an account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
