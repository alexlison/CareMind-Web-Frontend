import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, UserPlus, User, LogOut, Menu, X,
  Home, Calendar, Bell,
  HeartPulse, Activity, ClipboardCheck,
  MessageSquare
} from 'lucide-react';
import PatientManagement from './PatientManagement';

const CaregiverHome = () => {
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [stats] = useState({
    totalPatients: 0,
    activePatients: 0,
    pendingTasks: 0,
    todayAppointments: 0
  });
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { id: 'patients', label: 'Patients', icon: <Users className="w-5 h-5" /> },
    { id: 'tasks', label: 'Tasks', icon: <ClipboardCheck className="w-5 h-5" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
  ];

  useEffect(() => {
    let isMounted = true;

    const initializeUser = () => {
      const token = sessionStorage.getItem('token');
      const storedUserName = sessionStorage.getItem('userName');
      const storedUserId = sessionStorage.getItem('userId');
      const storedUserType = sessionStorage.getItem('userType');

      if (!token) {
        navigate('/login');
        return;
      }

      if (storedUserType !== 'caregiver') {
        navigate('/login');
        return;
      }

      if (isMounted) {
        if (storedUserName) {
          setUserName(storedUserName);
        } else {
          setUserName('Caregiver');
        }
        
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          setUserId('');
        }
      }
    };

    initializeUser();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#2d9134] to-[#359a3a] rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}!</h1>
            <p className="text-green-100">Here is an overview of your caregiving activities.</p>
          </div>
          <HeartPulse className="w-16 h-16 opacity-20" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Patients</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.totalPatients}</h3>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#2d9134] to-[#359a3a] rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600">Patients under your care</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Patients</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.activePatients}</h3>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600">Currently active patients</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Tasks</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.pendingTasks}</h3>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600">Tasks to complete today</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Today&apos;s Appointments</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.todayAppointments}</h3>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600">Scheduled for today</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setActiveTab('patients')}
            className="p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2d9134] rounded-lg flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Add New Patient</div>
                <div className="text-sm text-gray-600 mt-1">Register a new patient</div>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => setActiveTab('patients')}
            className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">View All Patients</div>
                <div className="text-sm text-gray-600 mt-1">Manage your patients</div>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => setActiveTab('tasks')}
            className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">View Tasks</div>
                <div className="text-sm text-gray-600 mt-1">{stats.pendingTasks} pending tasks</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

const renderPatients = () => (
  <PatientManagement />
);

  const renderTasks = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
      <ClipboardCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-gray-900 mb-2">Tasks Management</h3>
      <p className="text-gray-500">View and manage your caregiving tasks</p>
    </div>
  );

  const renderMessages = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
      <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-gray-900 mb-2">Messages</h3>
      <p className="text-gray-500">Communicate with patients and colleagues</p>
    </div>
  );

  const renderNotifications = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
      <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-gray-900 mb-2">Notifications</h3>
      <p className="text-gray-500">View your notifications and alerts</p>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'patients':
        return renderPatients();
      case 'tasks':
        return renderTasks();
      case 'messages':
        return renderMessages();
      case 'notifications':
        return renderNotifications();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className={`
        fixed top-0 left-0 h-full bg-white shadow-2xl z-30 transition-transform duration-300 ease-in-out
        w-64
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#2d9134] to-[#359a3a] rounded-lg flex items-center justify-center">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">Care<span className="font-light">Mind</span></div>
              <div className="text-xs font-semibold text-[#2d9134]">Caregiver Panel</div>
            </div>
          </div>
        </div>


        <nav className="p-4 space-y-1 h-[calc(100vh-220px)]">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors
                ${activeTab === item.id 
                  ? 'bg-green-100 text-[#2d9134] font-semibold' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#2d9134]'
                }
              `}
            >
              <div className={`${activeTab === item.id ? 'text-[#2d9134]' : 'text-gray-500'}`}>
                {item.icon}
              </div>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <header className="fixed top-0 right-0 bg-lime-100 shadow-sm border-b border-gray-200 z-20 lg:left-64 left-0">
        <div className="px-6 py-4 flex items-center justify-between h-full">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              aria-label="Toggle sidebar"
            >
              {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div>
              <h1 className="text-2xl text-left font-bold text-gray-900 capitalize">
                {activeTab === 'dashboard' ? 'Dashboard' : activeTab}
              </h1>
              <p className="text-sm text-gray-600">Manage your caregiving activities</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-[#2d9134] to-[#359a3a] hover:from-[#1B5E20] hover:to-[#2E7D32] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="transition-all duration-300 min-h-screen pt-16 lg:ml-64">
        <div className="p-6">
          {renderTabContent()}
        </div>
      </main>

      <footer className="lg:ml-64 border-t border-gray-200 bg-white">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} CareMind. All rights reserved.
          </div>
          <div className="text-sm text-gray-600">
            Caregiver ID: {userId ? `CG-${userId.slice(-6).toUpperCase()}` : 'N/A'}
          </div>
        </div>
      </footer>

      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-10"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default CaregiverHome;