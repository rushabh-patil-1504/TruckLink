import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Truck, ArrowRight, UserCheck, Bell, Menu, X, ChevronDown, LogOut, ArrowRightLeft, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import NotificationDropdown from '../shared/NotificationDropdown';
import RoleSwitchModal from '../shared/RoleSwitchModal';

const Navbar = () => {
  const { user, isAuthenticated, activeRole, logout } = useAuth();
  const { unreadCount } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [switchModalOpen, setSwitchModalOpen] = useState(false);

  const isPublicPage = ['/', '/services', '/places', '/reviews', '/contact', '/login', '/signup', '/auth'].includes(location.pathname);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Places We Serve', path: '/places' },
    { label: 'Book a Demo', path: '/auth' },
    { label: 'Reviews', path: '/reviews' },
    { label: 'Contact Us', path: '/contact' }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white flex items-center justify-center shadow-brand transform group-hover:scale-105 transition-transform duration-300">
              <Truck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight text-navy-900 font-sans leading-none">
                Truck<span className="text-brand-500">Link</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase leading-tight mt-0.5">
                Freight & Logistics Network
              </span>
            </div>
          </Link>

          {/* Desktop Public Navigation Links */}
          {isPublicPage && (
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'text-brand-600 bg-brand-50/80'
                        : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* User Operations Link if on dashboard pages */}
          {!isPublicPage && user && (
            <nav className="hidden md:flex items-center gap-3">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {activeRole === 'DRIVER' ? 'Operations Portal (Driver)' : 'Freight Hub (Company)'}
              </span>
            </nav>
          )}

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-sm font-semibold text-navy-800 hover:text-brand-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-brand hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Book a Demo
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <>
                {/* Role Switcher Button */}
                <button
                  onClick={() => setSwitchModalOpen(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all shadow-sm"
                  title="Switch between Driver and Company Profile"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-brand-600" />
                  <span>Switch to {activeRole === 'DRIVER' ? 'Company' : 'Driver'}</span>
                </button>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationOpen(!notificationOpen)}
                    className="p-2.5 rounded-xl text-slate-600 hover:text-navy-900 hover:bg-slate-100 relative transition-all"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5 stroke-[2]" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-brand-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-bounce">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notificationOpen && (
                    <NotificationDropdown onClose={() => setNotificationOpen(false)} />
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100/80 transition-all border border-transparent hover:border-slate-200"
                  >
                    <div className="w-9 h-9 rounded-lg bg-navy-900 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden lg:flex flex-col text-left">
                      <span className="text-xs font-bold text-navy-900 leading-tight">{user.name}</span>
                      <span className="text-[10px] font-semibold text-slate-500 capitalize">
                        {activeRole === 'DRIVER' ? 'Truck Owner / Driver' : 'Business Owner'}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-card border border-slate-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-400">Signed in as</p>
                        <p className="text-sm font-bold text-navy-900 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to={activeRole === 'DRIVER' ? '/driver/dashboard' : '/company/dashboard'}
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 font-medium"
                        >
                          <UserCheck className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          to={activeRole === 'DRIVER' ? '/driver/profile' : '/company/profile'}
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 font-medium"
                        >
                          <Shield className="w-4 h-4" />
                          Profile & Settings
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                            navigate('/');
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="sm:hidden flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 text-slate-700 relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-brand-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-navy-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-50 rounded-lg"
              >
                {link.label}
              </Link>
            ))}
            
            {!isAuthenticated ? (
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-bold text-navy-900 border border-slate-200 rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-bold text-white bg-brand-500 rounded-xl shadow-brand"
                >
                  Book a Demo
                </Link>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSwitchModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-navy-900 font-bold rounded-xl text-sm"
                >
                  <ArrowRightLeft className="w-4 h-4 text-brand-500" />
                  Switch to {activeRole === 'DRIVER' ? 'Company' : 'Driver'}
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="w-full text-center py-2.5 text-rose-600 font-bold border border-rose-100 rounded-xl bg-rose-50"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Role Switch Modal */}
      {switchModalOpen && (
        <RoleSwitchModal onClose={() => setSwitchModalOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
