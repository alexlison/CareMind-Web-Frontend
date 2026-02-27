import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Activity, Pill, User, Edit2,
  Mail, Phone, MapPin, CheckCircle, Heart,
  Award, Shield
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const CaregiverDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchDashboardData(token);
  }, [navigate]);

  const fetchDashboardData = async (token) => {
    setLoading(true);
    try {
      const [statsRes, profileRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/caregiver/dashboard/stats`, { headers: { token } }),
        axios.get(`${API_BASE_URL}/caregiver/Myprofile`, { headers: { token } }),
      ]);
      
      if (statsRes.data.status === 'SUCCESS') setStats(statsRes.data.data);
      if (profileRes.data.status === 'SUCCESS') setProfile(profileRes.data.data);
    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-20 h-20 border-4 border-green-100 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-[#2d9134] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-6 text-sm font-medium text-[#2d9134]">Loading your dashboard...</p>
          <p className="text-xs text-gray-400 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Total Patients', 
      value: stats?.totalPatients || 0, 
      sub: `${stats?.activePatients || 0} active`, 
      icon: Users, 
      light: 'bg-green-50',
      text: 'text-[#2d9134]',
      border: 'border-green-200'
    },
    { 
      label: 'Total Routines', 
      value: stats?.totalRoutines || 0, 
      sub: 'Daily activities', 
      icon: Activity, 
      light: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200'
    },
    { 
      label: 'Total Medicines', 
      value: stats?.totalMedicines || 0, 
      sub: 'Prescriptions', 
      icon: Pill, 
      light: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-200'
    },
    { 
      label: 'Total Relations', 
      value: stats?.totalRelations || 0, 
      sub: 'Family contacts', 
      icon: Heart, 
      light: 'bg-pink-50',
      text: 'text-pink-600',
      border: 'border-pink-200'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.label} 
              className={`bg-white rounded-xl border ${item.border} shadow-sm p-5 hover:shadow-md transition-all duration-200 group`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 ${item.light} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${item.text}`} />
                </div>
                <span className="text-2xl font-bold p-2 px-4 rounded-xl bg-lime-100 text-gray-900">{item.value}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                <p className="text-xs text-gray-400 mt-1">{item.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-white px-5 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2d9134] bg-opacity-10 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-[#2d9134]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
                <p className="text-xs text-gray-500 mt-0.5">Manage your personal details</p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/editCaregiver')}
              className="flex items-center gap-2 px-4 py-2 bg-[#2d9134] hover:bg-[#1e6b24] text-white rounded-lg font-medium transition-colors text-sm shadow-sm"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#2d9134] to-[#1e6b24] rounded-xl flex items-center justify-center shadow-sm">
              <User className="w-10 h-10 text-white" />
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{profile?.name || 'Not provided'}</h3>
              <p className="text-sm text-gray-500 mb-3">Caregiver</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5 text-[#2d9134]" />
                  <span className="text-xs font-medium text-[#2d9134]">Verified</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs font-medium text-amber-600">Active</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 rounded-full">
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600">Caregiver</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-center px-3 py-2 bg-green-50 rounded-lg">
                <p className="text-lg font-bold text-[#2d9134]">{stats?.totalPatients || 0}</p>
                <p className="text-xs text-gray-600">Patients</p>
              </div>
              <div className="text-center px-3 py-2 bg-blue-50 rounded-lg">
                <p className="text-lg font-bold text-blue-600">{stats?.totalRoutines || 0}</p>
                <p className="text-xs text-gray-600">Routines</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-[#2d9134]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-0.5">Email</p>
                <p className="text-sm font-medium text-gray-800 truncate">{profile?.email || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                <p className="text-sm font-medium text-gray-800">{profile?.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-0.5">Gender</p>
                <p className="text-sm font-medium text-gray-800 capitalize">{profile?.gender || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-pink-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-0.5">Location</p>
                <p className="text-sm font-medium text-gray-800 truncate">
                  {[profile?.address?.city, profile?.address?.state].filter(Boolean).join(', ') || 'Not provided'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/caregiver/patients')}
          className="group bg-white rounded-xl border border-green-200 p-5 hover:shadow-md transition-all text-left"
        >
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6 text-[#2d9134]" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Patients</h3>
          <p className="text-xs text-gray-500 mb-2">Manage your patients</p>
          <div className="flex items-center gap-2 text-xs font-medium text-[#2d9134]">
            <span>{stats?.totalPatients || 0} total</span>
            <span className="w-1 h-1 bg-green-300 rounded-full"></span>
            <span>{stats?.activePatients || 0} active</span>
          </div>
        </button>

        <button
          className="group bg-white rounded-xl border border-blue-200 p-5 hover:shadow-md transition-all text-left"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Routines</h3>
          <p className="text-xs text-gray-500 mb-2">Daily schedules</p>
          <div className="flex items-center gap-2 text-xs font-medium text-blue-600">
            <span>{stats?.totalRoutines || 0} total</span>
          </div>
        </button>

        <button
          className="group bg-white rounded-xl border border-purple-200 p-5 hover:shadow-md transition-all text-left"
        >
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Pill className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Medicines</h3>
          <p className="text-xs text-gray-500 mb-2">Track medications</p>
          <div className="flex items-center gap-2 text-xs font-medium text-purple-600">
            <span>{stats?.totalMedicines || 0} total</span>
          </div>
        </button>
      </div>

      <div className="text-center pt-2 pb-1">
        <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
          <Heart className="w-3 h-3 text-[#2d9134]" />
          Making a difference in patient lives
          <Heart className="w-3 h-3 text-[#2d9134]" />
        </p>
      </div>
    </div>
  );
};

export default CaregiverDashboard;