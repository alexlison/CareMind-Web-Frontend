import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, CheckCircle, Clock, Calendar, User, Trash2, 
  CheckCheck, AlertCircle, XCircle, Mail, MailOpen,
  Filter, ChevronDown
} from "lucide-react";

const NotificationManagement = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [filter, setFilter] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const fetchNotifications = async (authToken) => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/caregiver/notifications",
        { headers: { 'token': authToken } }
      );

      if (response.data.status === "SUCCESS") {
        setNotifications(response.data.data || []);
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setServerError("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/caregiver/notifications/${notificationId}/read`,
        {},
        { headers: { 'token': token } }
      );

      if (response.data.status === "SUCCESS") {
        setNotifications(prev => 
          prev.map(n => 
            n._id === notificationId ? { ...n, read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    if (unreadNotifications.length === 0) return;

    try {
      for (const notification of unreadNotifications) {
        await axios.put(
          `http://localhost:5000/api/caregiver/notifications/${notification._id}/read`,
          {},
          { headers: { 'token': token } }
        );
      }

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/caregiver/notifications/${notificationId}`,
        { headers: { 'token': token } }
      );

      if (response.data.status === "SUCCESS") {
        const deletedNotification = notifications.find(n => n._id === notificationId);
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        if (deletedNotification && !deletedNotification.read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const clearAllNotifications = async () => {
    if (notifications.length === 0) return;

    try {
      const response = await axios.delete(
        "http://localhost:5000/api/caregiver/notifications/clear/all",
        { headers: { 'token': token } }
      );

      if (response.data.status === "SUCCESS") {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    const storedUserType = sessionStorage.getItem("userType");

    if (!storedToken || storedUserType !== "caregiver") {
      navigate("/");
      return;
    }

    setToken(storedToken);
    fetchNotifications(storedToken);

    const interval = setInterval(() => {
      if (storedToken) {
        fetchNotifications(storedToken);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [navigate]);

  const isLastHour = (dateString) => {
    const notifDate = new Date(dateString);
    const now = new Date();
    const diffMs = now - notifDate;
    const diffMins = diffMs / 60000;
    return diffMins <= 60;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
  };

  const formatTaskDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;
    
    if (filter === 'unread') {
      filtered = notifications.filter(n => !n.read);
    } else if (filter === 'urgent') {
      filtered = notifications.filter(n => isLastHour(n.createdAt));
    }
    
    return filtered;
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-[#2d9134] to-[#1B5E20] rounded-xl p-6 mb-6 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-green-100 text-sm mt-1">Manage your caregiving activities</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Filter Toggle for Mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Filter Buttons - Desktop */}
            <div className={`${showFilters ? 'flex' : 'hidden'} lg:flex items-center gap-2 bg-white/10 rounded-lg p-1`}>
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === 'all' ? 'bg-white text-[#2d9134]' : 'text-white hover:bg-white/20'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === 'unread' ? 'bg-white text-[#2d9134]' : 'text-white hover:bg-white/20'
                }`}
              >
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </button>
              <button
                onClick={() => setFilter('urgent')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === 'urgent' ? 'bg-white text-[#2d9134]' : 'text-white hover:bg-white/20'
                }`}
              >
                Last Hour
              </button>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-[#2d9134] hover:bg-green-50 rounded-lg transition-colors font-medium text-sm"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Mark all read</span>
                </button>
              )}
              
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm"
                  title="Clear all notifications"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear all</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filters - Expandable */}
        {showFilters && (
          <div className="lg:hidden flex flex-col gap-2 mt-4 pt-4 border-t border-white/20">
            <button
              onClick={() => { setFilter('all'); setShowFilters(false); }}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                filter === 'all' ? 'bg-white text-[#2d9134]' : 'text-white hover:bg-white/20'
              }`}
            >
              All Notifications
            </button>
            <button
              onClick={() => { setFilter('unread'); setShowFilters(false); }}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                filter === 'unread' ? 'bg-white text-[#2d9134]' : 'text-white hover:bg-white/20'
              }`}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
            <button
              onClick={() => { setFilter('urgent'); setShowFilters(false); }}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                filter === 'urgent' ? 'bg-white text-[#2d9134]' : 'text-white hover:bg-white/20'
              }`}
            >
              Last Hour
            </button>
          </div>
        )}
      </div>

      {serverError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            {serverError}
          </p>
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="inline-block w-8 h-8 border-3 border-gray-200 border-t-[#2d9134] rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Loading notifications...</p>
        </div>
      )}

      {!loading && filteredNotifications.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-500">
            {filter === 'all' ? 'You\'re all caught up!' : 
             filter === 'unread' ? 'No unread notifications' : 
             'No notifications in the last hour'}
          </p>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="mt-4 text-[#2d9134] hover:text-[#1B5E20] font-medium text-sm"
            >
              View all notifications →
            </button>
          )}
        </div>
      )}

      {!loading && filteredNotifications.length > 0 && (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => {
            const isNew = !notification.read && isLastHour(notification.createdAt);
            
            return (
              <div
                key={notification._id}
                className={`bg-white rounded-xl border ${
                  isNew ? 'border-[#2d9134] shadow-md' : 'border-gray-300'
                } overflow-hidden hover:shadow-lg transition-shadow`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-lg ms-3 font-semibold text-gray-800">
                          {notification.title}
                        </h2>
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          Urgent
                        </span>
                        {isNew && (
                          <span className="px-2 py-1 bg-[#2d9134] text-white text-xs font-medium rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 ms-6 mt-4 mb-3 leading-relaxed bg-lime-50 p-5 border rounded-2xl">
                        {notification.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 ml-4">
                      {!notification.read ? (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="p-2 text-[#2d9134] hover:bg-green-50 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <MailOpen className="w-5 h-5" />
                        </button>
                      ) : (
                        <button
                          className="p-2 text-gray-300 cursor-not-allowed"
                          disabled
                          title="Already read"
                        >
                          <Mail className="w-5 h-5 text-lime-300" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-gray-300">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Patient</p>
                        <p className="font-medium text-gray-900">{notification.patientName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Scheduled</p>
                        <p className="font-medium text-gray-900">{notification.scheduledTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Received</p>
                        <p className="font-medium text-gray-900">{formatDateTime(notification.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-medium text-gray-600">{formatTaskDate(notification.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationManagement;