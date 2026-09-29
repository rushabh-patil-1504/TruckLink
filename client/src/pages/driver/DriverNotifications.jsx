import React from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import DriverHeader from '../../components/driver/DriverHeader';
import { useSocket } from '../../context/SocketContext';
import { formatDateTime } from '../../utils/formatters';

const DriverNotifications = () => {
  const { notifications, unreadCount, markNotificationRead, markAllRead } = useSocket();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <DriverHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow space-y-6 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-navy-900 font-sans flex items-center gap-2">
            <Bell className="w-6 h-6 text-brand-500" />
            <span>Driver Notifications</span>
          </h2>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs font-bold text-brand-600 flex items-center gap-1">
              <CheckCheck className="w-4 h-4" /> Mark all read
            </button>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft divide-y divide-slate-100 overflow-hidden">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-slate-400">No notifications found</div>
          ) : (
            notifications.map((n) => (
              <div key={n._id} onClick={() => markNotificationRead(n._id)} className={`p-5 cursor-pointer hover:bg-slate-50 ${!n.read ? 'bg-brand-50/20' : ''}`}>
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-extrabold text-navy-900">{n.title}</h4>
                  <span className="text-xs text-slate-400">{formatDateTime(n.createdAt)}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{n.message}</p>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DriverNotifications;
