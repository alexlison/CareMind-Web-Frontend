import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, User, Mail, Phone, Calendar, Shield,
    CheckCircle, AlertCircle, Loader, ArrowLeft,
    ToggleLeft, ToggleRight, Search, Filter,
    MapPin, Heart, Activity, Image as ImageIcon,
    Mars
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const AdminViewAllCaregivers = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [caregivers, setCaregivers] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [togglingId, setTogglingId] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const userType = sessionStorage.getItem('userType');

        if (!token || userType !== 'admin') {
            navigate('/login');
            return;
        }
        fetchCaregivers(token);
    }, [navigate]);

    const fetchCaregivers = async (token) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/Allcaregivers`, {
                headers: { token }
            });

            if (response.data.status === "SUCCESS") {
                setCaregivers(response.data.data || []);
            } else {
                setError(response.data.message || "Failed to load caregivers");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Failed to load caregivers");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (caregiverId, currentStatus) => {
        const token = sessionStorage.getItem('token');
        setTogglingId(caregiverId);

        try {
            const response = await axios.put(
                `${API_BASE_URL}/admin/caregivers/toggle-status/${caregiverId}`,
                {},
                { headers: { token } }
            );

            if (response.data.status === "SUCCESS") {
                setCaregivers(prev => prev.map(cg =>
                    cg._id === caregiverId
                        ? { ...cg, isActive: !currentStatus }
                        : cg
                ));
            } else {
                alert(response.data.message || "Failed to toggle status");
            }
        } catch (err) {
            console.error("Toggle error:", err);
            alert(err.response?.data?.message || "Failed to toggle status");
        } finally {
            setTogglingId(null);
        }
    };

    const filteredCaregivers = caregivers.filter(cg => {
        const matchesSearch =
            (cg.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (cg.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (cg.phone || '').includes(searchTerm);

        const matchesFilter =
            filterStatus === 'all' ? true :
                filterStatus === 'active' ? cg.isActive === true :
                    filterStatus === 'inactive' ? cg.isActive === false : true;

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="w-full py-12">
                <div className="flex flex-col items-center justify-center">
                    <Loader className="w-12 h-12 text-[#2d9134] animate-spin" />
                    <p className="mt-4 text-gray-600">Loading caregivers...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full py-12">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Caregivers</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => fetchCaregivers(sessionStorage.getItem('token'))}
                        className="px-6 py-2 bg-[#2d9134] text-white rounded-lg hover:bg-[#1B5E20]"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">

                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-lime-300 to-green-400 rounded-xl flex items-center justify-center shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-left text-gray-900">All Caregivers</h1>
                        <p className="text-sm text-gray-500">Manage and monitor all caregivers</p>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by name, email or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d9134] focus:border-transparent outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Filter className="w-5 h-5 text-gray-500" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d9134] focus:border-transparent outline-none bg-white"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active Only</option>
                            <option value="inactive">Inactive Only</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Total Caregivers</p>
                    <p className="text-2xl font-bold text-gray-900">{caregivers.length}</p>
                </div>
                <div className="bg-white rounded-xl border border-green-200 p-4">
                    <p className="text-sm text-gray-500">Active</p>
                    <p className="text-2xl font-bold text-green-600">
                        {caregivers.filter(c => c.isActive).length}
                    </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Inactive</p>
                    <p className="text-2xl font-bold text-gray-400">
                        {caregivers.filter(c => !c.isActive).length}
                    </p>
                </div>
                <div className="bg-white rounded-xl border border-blue-200 p-4">
                    <p className="text-sm text-gray-500">Total Patients</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {caregivers.reduce((sum, c) => sum + (c.patientCount || 0), 0)}
                    </p>
                </div>
            </div>

            {filteredCaregivers.length > 0 ? (
                <div className="space-y-4">
                    {filteredCaregivers.map((cg) => (
                        <div
                            key={cg._id}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                        >
                            <div className={`h-1.5 ${cg.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />

                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-lime-300 to-lime-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                            <span className="text-2xl font-bold text-white">
                                                {cg.name?.charAt(0).toUpperCase() || 'C'}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{cg.name || 'Unknown'}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${cg.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {cg.isActive ? (
                                                        <>
                                                            <CheckCircle className="w-3 h-3" />
                                                            Active
                                                        </>
                                                    ) : (
                                                        <>
                                                            <AlertCircle className="w-3 h-3" />
                                                            Inactive
                                                        </>
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    <Mars className="w-4 h-4 text-gray-400" />   <span>{cg.gender}</span>
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    <span>{cg.email}</span>
                                                </div>
                                                {cg.phone && (
                                                    <div className="flex items-center gap-1 text-gray-600">
                                                        <Phone className="w-4 h-4 text-gray-400" />
                                                        <span>{cg.phone}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    <Users className="w-4 h-4 text-gray-400" />
                                                    <span>{cg.patientCount || 0} patients</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0">
                                        <button
                                            onClick={() => handleToggleStatus(cg._id, cg.isActive)}
                                            disabled={togglingId === cg._id}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${cg.isActive
                                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                }`}
                                        >
                                            {togglingId === cg._id ? (
                                                <Loader className="w-4 h-4 animate-spin" />
                                            ) : cg.isActive ? (
                                                <>
                                                    <ToggleRight className="w-4 h-4" />
                                                    Deactivate
                                                </>
                                            ) : (
                                                <>
                                                    <ToggleLeft className="w-4 h-4" />
                                                    Activate
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No caregivers found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
                </div>
            )}
        </div>
    );
};

export default AdminViewAllCaregivers;