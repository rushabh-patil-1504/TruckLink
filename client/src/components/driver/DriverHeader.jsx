import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, Package, Navigation, Clock, Bell, User, Settings, ArrowRightLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DriverHeader = () => {
  const { user } = useAuth();

  const driverLinks = [
    { label: 'Operations Overview', path: '/driver/dashboard', icon: LayoutDashboard },
    { label: 'Fleet Availability', path: '/driver/availability', icon: CalendarCheck },
    { label: 'Incoming Requests', path: '/driver/requests', icon: Clock },
    { label: 'My Bookings', path: '/driver/bookings', icon: Package },
    { label: 'Active Delivery', path: '/driver/delivery', icon: Navigation },
    { label: 'Notifications', path: '/driver/notifications', icon: Bell },
    { label: 'Profile & Settings', path: '/driver/profile', icon: Settings },
  ];

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Driver Operations Hub</span>
            <h1 className="text-2xl font-extrabold text-navy-900 font-sans">
              Welcome back, {user?.name} 🚛
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
              ● Active Driver Portal
            </span>
          </div>
        </div>

        {/* Tab Links */}
        <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
          {driverLinks.map((link) => {
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

export default DriverHeader;
