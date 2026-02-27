import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, LogOut, Menu, X,
  Home, Bell, Shield,
  Settings, Activity,
  BarChart3, UserCog, FileText, AlertTriangle,
  Bed
} from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import AdminViewAllCaregivers from './AdminViewallCaregivers';
import AdminViewAllPatients from './AdminViewallPatients';

const AdminHome = () => {
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { id: 'caregivers', label: 'Caregivers', icon: <Users className="w-5 h-5" /> },
    { id: 'patients', label: 'Patients', icon: <Bed className="w-5 h-5" /> },

  ];

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#2d9134] to-[#359a3a] rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
            <p className="text-green-100 text-left">Here's an overview of your system.</p>
          </div>
          <Shield className="w-16 h-16 opacity-20" />
        </div>
      </div>


      <AdminDashboard />

    </div>
  );
  const renderCaregivers = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">

      <AdminViewAllCaregivers />

    </div>
  );
  const renderPatients = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">

        <AdminViewAllPatients />

      </div>
    </div>
  );
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'caregivers':
        return renderCaregivers('Caregivers');
      case 'patients':
        return renderPatients('Patients');
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-white shadow-2xl z-30 transition-transform duration-300 ease-in-out
        w-64
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#2d9134] to-[#359a3a] rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">Care<span className="font-light">Mind</span></div>
              <div className="text-xs font-semibold text-[#2d9134]">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
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

      {/* Header */}
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
              <p className="text-sm text-gray-600">Manage system and users</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
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

      {/* Main Content */}
      <main className="transition-all duration-300 min-h-screen pt-16 lg:ml-64">
        <div className="p-6">
          {renderTabContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="lg:ml-64 border-t border-gray-200 bg-white">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} CareMind. All rights reserved.
          </div>
          <div className="text-sm text-gray-600">
            Admin ID: AD-123456
          </div>
        </div>
      </footer>

      {/* Mobile Overlay */}
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

export default AdminHome;