import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import API from '../services/api';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestToast, setLatestToast] = useState(null);

  // Fetch notifications from backend on login
  useEffect(() => {
    if (user) {
      API.get('/notifications')
        .then((res) => {
          setNotifications(res.data);
          setUnreadCount(res.data.filter((n) => !n.read).length);
        })
        .catch((err) => console.error('[Notifications Error]', err));
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  // Socket Connection Setup
  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      autoConnect: true
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Join Room & Listeners
  useEffect(() => {
    if (!socket || !user) return;

    socket.emit('join_user_room', user._id);

    const handleNotification = (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((prev) => prev + 1);
      setLatestToast(notif);
      setTimeout(() => setLatestToast(null), 5000);
    };

    socket.on('notification_received', handleNotification);

    return () => {
      socket.off('notification_received', handleNotification);
    };
  }, [socket, user]);

  const markNotificationRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('[Read Error]', err);
    }
  };

  const markAllRead = async () => {
    try {
      await API.put('/notifications/mark-all-read');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('[Mark All Read Error]', err);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        unreadCount,
        latestToast,
        markNotificationRead,
        markAllRead
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
