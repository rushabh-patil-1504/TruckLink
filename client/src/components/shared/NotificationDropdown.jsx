import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Package, MapPin, CreditCard, Info } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { formatDateTime } from '../../utils/formatters';

const NotificationDropdown = ({ onClose }) => {
  const { notifications, unreadCount, markNotificationRead, markAllRead } = useSocket();

  const getIcon = (type) => {
    switch (type) {
      case 'BOOKING':
        return <Package className="w-4 h-4 text-brand-500" />;
      case 'CHECKPOINT':
        return <MapPin className="w-4 h-4 text-indigo-500" />;
      case 'PAYMENT':
        return <CreditCard className="w-4 h-4 text-emerald-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-card border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      
      {/* Header */}
      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-navy-900" />
          <span className="font-extrabold text-sm text-navy-900">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 text-xs font-bold">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs font-semibold">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => markNotificationRead(notif._id)}
              className={`p-3.5 transition-colors cursor-pointer hover:bg-slate-50 ${
                !notif.read ? 'bg-brand-50/30' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-navy-900 truncate">{notif.title}</p>
                    <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                      {formatDateTime(notif.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">{notif.message}</p>
                  {notif.link && (
                    <Link
                      to={notif.link}
                      onClick={onClose}
                      className="inline-block text-[11px] font-bold text-brand-600 hover:underline mt-1.5"
                    >
                      View details →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default NotificationDropdown;
