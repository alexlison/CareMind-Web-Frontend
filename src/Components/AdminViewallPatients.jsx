import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, User, Mail, Phone, Calendar,
    CheckCircle, AlertCircle, Loader, ArrowLeft,
    Search, Filter, Activity, Pill, Heart,
    Image as ImageIcon
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const IMAGE_BASE_URL = 'http://localhost:5000';

const AdminViewAllPatients = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const userType = sessionStorage.getItem('userType');

        if (!token || userType !== 'admin') {
            navigate('/login');
            return;
        }
        fetchPatients(token);
    }, [navigate]);

    const fetchPatients = async (token) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/Allpatients`, {
                headers: { token }
            });

            if (response.data.status === "SUCCESS") {
                setPatients(response.data.data || []);
            } else {
                setError(response.data.message || "Failed to load patients");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Failed to load patients");
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter(pt => {
        const matchesSearch =
            (pt.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (pt.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (pt.caregiverName?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterStatus === 'all' ? true :
                filterStatus === 'active' ? pt.isActive === true :
                    filterStatus === 'inactive' ? pt.isActive === false : true;

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="w-full py-12">
                <div className="flex flex-col items-center justify-center">
                    <Loader className="w-12 h-12 text-[#2d9134] animate-spin" />
                    <p className="mt-4 text-gray-600">Loading patients...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full py-12">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Patients</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => fetchPatients(sessionStorage.getItem('token'))}
                        className="px-6 py-2 bg-[#2d9134] text-white rounded-lg hover:bg-[#1B5E20]"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">

                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-left text-gray-900">All Patients</h1>
                        <p className="text-sm text-gray-500">View and monitor all patients</p>
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
                            placeholder="Search by name, email or caregiver..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d9134] focus:border-transparent outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Filter className="w-5 h-5 text-gray-500" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d9134] focus:border-transparent outline-none bg-white"
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
                    <p className="text-sm text-gray-500">Total Patients</p>
                    <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
                </div>
                <div className="bg-white rounded-xl border border-green-200 p-4">
                    <p className="text-sm text-gray-500">Active</p>
                    <p className="text-2xl font-bold text-green-600">
                        {patients.filter(p => p.isActive).length}
                    </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Inactive</p>
                    <p className="text-2xl font-bold text-gray-400">
                        {patients.filter(p => !p.isActive).length}
                    </p>
                </div>
                <div className="bg-white rounded-xl border border-purple-200 p-4">
                    <p className="text-sm text-gray-500">Total Tasks</p>
                    <p className="text-2xl font-bold text-purple-600">
                        {patients.reduce((sum, p) => sum + (p.routineCount || 0) + (p.medicineCount || 0), 0)}
                    </p>
                </div>
            </div>

            {filteredPatients.length > 0 ? (
                <div className="space-y-4">
                    {filteredPatients.map((pt) => (
                        <div
                            key={pt._id}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                        >
                            <div className={`h-1.5 w-full ${pt.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />

                            <div className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-shrink-0">
                                        {pt.imageUrl ? (
                                            <img
                                                src={`${IMAGE_BASE_URL}${pt.imageUrl}`}
                                                alt={pt.name}
                                                className="w-28 h-28 rounded-xl object-cover border-2 border-gray-200 shadow-sm"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.style.display = 'none';
                                                    const fallback = e.target.parentNode.querySelector('.fallback-image');
                                                    if (fallback) fallback.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className={`w-28 h-28 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex flex-col items-center justify-center border-2 border-gray-200 shadow-sm fallback-image ${pt.imageUrl ? 'hidden' : 'flex'
                                                }`}
                                            style={{ display: pt.imageUrl ? 'none' : 'flex' }}
                                        >
                                            <span className="text-4xl font-bold text-white">
                                                {pt.name?.charAt(0).toUpperCase() || 'P'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900">{pt.name}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${pt.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {pt.isActive ? (
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
                                                {pt.nickName && (
                                                    <p className="text-sm text-left text-gray-500 mt-3 mb-2">Nick Name:  <span className='text-gray-500 bg-lime-100 p-1 px-2 rounded-xl font-light'>"{pt.nickName}"</span></p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm font-medium text-gray-900">
                                                    Caregiver: {pt.caregiverName || 'Unknown'} ({pt.caregiverEmail})
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <span className="truncate">{pt.email}</span>
                                            </div>
                                            {pt.phone && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    <span>{pt.phone}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                                            <div className="text-center">
                                                <div className="flex items-center justify-center gap-1 text-purple-600">
                                                    <Activity className="w-5 h-5" />
                                                    <span className="text-xl font-bold">{pt.routineCount || 0}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">Routines</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="flex items-center justify-center gap-1 text-pink-600">
                                                    <Pill className="w-5 h-5" />
                                                    <span className="text-xl font-bold">{pt.medicineCount || 0}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">Medicines</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="flex items-center justify-center gap-1 text-rose-600">
                                                    <Heart className="w-5 h-5" />
                                                    <span className="text-xl font-bold">{pt.relationCount || 0}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">Relations</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No patients found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
                </div>
            )}
        </div>
    );
};

export default AdminViewAllPatients;