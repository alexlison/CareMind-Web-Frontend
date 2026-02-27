import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, User, Activity, Pill, Heart, Calendar,
    Shield, AlertCircle, CheckCircle,
    Loader, ChevronRight, TrendingUp, UserPlus,
    Clock, BarChart3, Sparkles, ArrowUpRight,
    UsersRound, Eye, DollarSign, Star
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const userType = sessionStorage.getItem('userType');

        if (!token || userType !== 'admin') {
            navigate('/login');
            return;
        }
        fetchDashboardStats(token);
    }, [navigate]);

    const fetchDashboardStats = async (token) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/dashboard/stats`, {
                headers: { token }
            });

            if (response.data.status === "SUCCESS") {
                setStats(response.data.data);
            } else {
                setError(response.data.message || "Failed to load dashboard");
            }
        } catch (err) {
            console.error("Dashboard error:", err);
            setError("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full py-12">
                <div className="flex flex-col items-center justify-center">
                    <Loader className="w-12 h-12 text-[#2d9134] animate-spin" />
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full py-12">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Dashboard</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => fetchDashboardStats(sessionStorage.getItem('token'))}
                        className="px-6 py-2 bg-[#2d9134] text-white rounded-lg hover:bg-[#1B5E20]"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const counts = stats?.counts || {};
    const currentMonth = new Date().toLocaleString('default', { month: 'short', year: 'numeric' });

    // Stats cards configuration
    const statCards = [
        {
            label: 'Total Caregivers',
            value: counts.totalCaregivers || 0,
            sub: `${counts.activeCaregivers || 0} active · ${counts.inactiveCaregivers || 0} inactive`,
            icon: Users,
            gradient: 'from-blue-500 to-blue-600',
            light: 'bg-blue-50',
            text: 'text-blue-600',
            border: 'border-blue-200',
            bg: 'bg-blue-500'
        },
        {
            label: 'Total Patients',
            value: counts.totalPatients || 0,
            sub: `${counts.activePatients || 0} active · ${counts.inactivePatients || 0} inactive`,
            icon: User,
            gradient: 'from-green-500 to-green-600',
            light: 'bg-green-50',
            text: 'text-[#2d9134]',
            border: 'border-green-200',
            bg: 'bg-green-500'
        },
        {
            label: 'Total Routines',
            value: counts.totalRoutines || 0,
            sub: 'Daily activities',
            icon: Activity,
            gradient: 'from-purple-500 to-purple-600',
            light: 'bg-purple-50',
            text: 'text-purple-600',
            border: 'border-purple-200',
            bg: 'bg-purple-500'
        },
        {
            label: 'Total Medicines',
            value: counts.totalMedicines || 0,
            sub: 'Prescriptions',
            icon: Pill,
            gradient: 'from-pink-500 to-pink-600',
            light: 'bg-pink-50',
            text: 'text-pink-600',
            border: 'border-pink-200',
            bg: 'bg-pink-500'
        },
        {
            label: 'Total Relations',
            value: counts.totalRelations || 0,
            sub: 'Family contacts',
            icon: Heart,
            gradient: 'from-rose-500 to-rose-600',
            light: 'bg-rose-50',
            text: 'text-rose-600',
            border: 'border-rose-200',
            bg: 'bg-rose-500'
        }
    ];

    const monthlyStats = [
        {
            label: 'New Caregivers',
            value: Math.floor(counts.totalCaregivers * 0.15) || 3,
            icon: UserPlus,
            color: 'blue',
            bg: 'bg-blue-100',
            text: 'text-blue-600'
        },
        {
            label: 'New Patients',
            value: Math.floor(counts.totalPatients * 0.2) || 4,
            icon: UsersRound,
            color: 'green',
            bg: 'bg-green-100',
            text: 'text-[#2d9134]'
        },
        {
            label: 'Active Today',
            value: Math.floor((counts.activeCaregivers + counts.activePatients) * 0.7) || 5,
            icon: Activity,
            color: 'purple',
            bg: 'bg-purple-100',
            text: 'text-purple-600'
        },
        {
            label: 'Completion',
            value: '94%',
            icon: CheckCircle,
            color: 'emerald',
            bg: 'bg-emerald-100',
            text: 'text-emerald-600'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-lg transition-all duration-300 group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={`w-12 h-12 ${card.light} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className={`w-6 h-6 ${card.text}`} />
                                </div>
                                <span className="text-2xl font-bold text-gray-900">{card.value}</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-700">{card.label}</p>
                            <p className="text-xs text-gray-400 mt-2">{card.sub}</p>
                            <div className={`h-1 ${card.bg} rounded-full mt-3 opacity-20 group-hover:opacity-40 transition-opacity`} />
                        </div>
                    );
                })}
            </div>

            {/* Monthly Overview */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#2d9134]/10 rounded-xl flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-[#2d9134]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{currentMonth} Overview</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Key metrics this month</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 rounded-full">
                            <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-xs font-medium text-green-600">+12% vs last month</span>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {monthlyStats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                                            <Icon className={`w-6 h-6 ${stat.text}`} />
                                        </div>
                                        <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                                            <ArrowUpRight className="w-3 h-3 text-green-600" />
                                            <span className="text-xs font-medium text-green-600">↑</span>
                                        </div>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                                    <p className="text-sm text-gray-500">{stat.label}</p>
                                </div>
                            );
                        })}
                    </div>


                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all group text-left"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Users className="w-7 h-7 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Caregivers</h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                        {counts.totalCaregivers || 0} total
                                    </span>
                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                        {counts.activeCaregivers || 0} active
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </button>

                <button
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all group text-left"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <User className="w-7 h-7 text-[#2d9134]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Patients</h3>

                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                        {counts.totalPatients || 0} total
                                    </span>
                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                        {counts.activePatients || 0} active
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;