import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, PlusCircle, Package, Navigation, History, Star, Bell, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CompanyHeader = () => {
  const { user } = useAuth();

  const companyLinks = [
    { label: 'Operations Dashboard', path: '/company/dashboard', icon: LayoutDashboard },
    { label: 'Available Fleet', path: '/company/drivers', icon: Users },
    { label: 'Book a Truck', path: '/company/create-booking', icon: PlusCircle },
    { label: 'My Bookings', path: '/company/bookings', icon: Package },
    { label: 'Active Deliveries', path: '/company/deliveries', icon: Navigation },
    { label: 'Ratings & Reviews', path: '/company/reviews', icon: Star },
    { label: 'Notifications', path: '/company/notifications', icon: Bell },
    { label: 'Company Profile', path: '/company/profile', icon: Settings },
  ];

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Freight & Logistics Hub</span>
            <h1 className="text-2xl font-extrabold text-navy-900 font-sans">
              {user?.companyProfile?.companyName || user?.name} 🏬
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-300">
              ● Company Operations Portal
            </span>
          </div>
        </div>

        {/* Tab Links */}
        <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
          {companyLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CompanyHeader;
