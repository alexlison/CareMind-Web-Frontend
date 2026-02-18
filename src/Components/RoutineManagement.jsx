import React, { useEffect, useState } from 'react';
import { 
  Clock, 
  Pill, 
  Activity, 
  Plus, 
  Edit2,
  Bell,
  Sun,
  Moon,
  Coffee,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = "http://localhost:5000/api/caregiver";

const RoutineManagement = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [routines, setRoutines] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [activeTab, setActiveTab] = useState('routines');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    const storedUserType = sessionStorage.getItem("userType");
    
    if (!storedToken || storedUserType !== "caregiver") {
      alert("Access denied! Only caregivers can access this page.");
      navigate("/");
      return;
    }
    
    setToken(storedToken);
  }, [navigate]);

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const headers = { 'token': token };
      
      const routinesRes = await axios.post(`${API}/allRoutines`, {}, { headers });
      if (routinesRes.data.status === "SUCCESS") {
        setRoutines(routinesRes.data.data);
      }
      
      const medicinesRes = await axios.post(`${API}/allMedicines`, {}, { headers });
      if (medicinesRes.data.status === "SUCCESS") {
        setMedicines(medicinesRes.data.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const endpoint = activeTab === 'routines' 
        ? `${API}/routineToggle-status/${item._id}`
        : `${API}/medicineToggle-status/${item._id}`;
      
      const res = await axios.put(endpoint, {}, { headers: { 'token': token } });
      
      if (res.data.status === "SUCCESS") {
        if (activeTab === 'routines') {
          setRoutines(routines.map(r => r._id === item._id ? res.data.data : r));
        } else {
          setMedicines(medicines.map(m => m._id === item._id ? res.data.data : m));
        }
      }
    } catch (error) {
      console.log("error->",error);
      alert("Failed to toggle status");
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'exercise': return Sun;
      case 'meal': return Coffee;
      case 'therapy': return Activity;
      default: return Activity;
    }
  };

  const StatusBadge = ({ status }) => {
    return status === 'active' ? (
      <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
        Active
      </span>
    ) : (
      <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
        Inactive
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d9134] mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-[#2d9134] bg-opacity-10 p-2 rounded-lg">
            {activeTab === 'routines' ? (
              <Activity className="w-6 h-6 text-[#2d9134]" />
            ) : (
              <Pill className="w-6 h-6 text-[#2d9134]" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {activeTab === 'routines' ? 'Routine Management' : 'Medicine Management'}
          </h2>
        </div>
        
        <button
          onClick={() => {
            if (activeTab === 'routines') {
              navigate('/addRoutine');
            } else {
              navigate('/addMedicine');
            }
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#2d9134] to-[#359a3a] hover:from-[#1B5E20] hover:to-[#2E7D32] text-white px-4 py-2 rounded-xl font-semibold transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add {activeTab === 'routines' ? 'Routine' : 'Medicine'}
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6 bg-white p-1 rounded-xl border border-gray-200 w-fit">
        <button
          onClick={() => setActiveTab('routines')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'routines'
              ? 'bg-[#2d9134] text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span className="font-medium">Routines</span>
        </button>
        <button
          onClick={() => setActiveTab('medicines')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'medicines'
              ? 'bg-[#2d9134] text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span className="font-medium">Medicines</span>
        </button>
      </div>

      <div className="mb-4 text-sm text-gray-500">
        Showing {activeTab === 'routines' ? routines.length : medicines.length} items
      </div>

      {activeTab === 'routines' && (
        <div className="space-y-4">
          {routines.map((routine) => {
            const IconComponent = getIcon(routine.type);
            return (
              <div
                key={routine._id}
                className="bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden w-full"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${
                        routine.type === 'exercise' ? 'bg-green-100' :
                        routine.type === 'meal' ? 'bg-orange-100' :
                        'bg-purple-100'
                      }`}>
                        <IconComponent className={`w-5 h-5 ${
                          routine.type === 'exercise' ? 'text-green-600' :
                          routine.type === 'meal' ? 'text-orange-600' :
                          'text-purple-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{routine.title}</h3>
                        <p className="text-sm text-gray-500">for {routine.patientId?.name || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleToggleStatus(routine)}
                        className="p-2 text-gray-500 hover:text-[#2d9134] hover:bg-green-50 rounded-lg transition-colors"
                        title="Toggle status"
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => navigate(`/editRoutine/${routine._id}`)}
                        className="p-2 text-gray-500 hover:text-[#2d9134] hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Time and frequency */}
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">{routine.scheduledTime}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{routine.frequency}</span>
                  </div>

                  {/* Description Card */}
                  {routine.description && (
                    <div className="bg-green-50 rounded-xl p-4 mb-4 border border-green-200">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">{routine.description}</p>
                      </div>
                    </div>
                  )}

                  {/* Status and Last completed */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Bell className="w-3 h-3" />
                      <span>Last: {routine.lastCompleted || 'Not completed'}</span>
                    </div>
                    <StatusBadge status={routine.status} />
                  </div>
                </div>
              </div>
            );
          })}
          {routines.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-200">
              No routines found. Click "Add Routine" to create one.
            </div>
          )}
        </div>
      )}

      {activeTab === 'medicines' && (
        <div className="space-y-4">
          {medicines.map((medicine) => (
            <div
              key={medicine._id}
              className="bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden w-full"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      {medicine.imageUrl ? (
                        <img 
                          src={`http://localhost:5000${medicine.imageUrl}`} 
                          alt={medicine.name} 
                          className="w-25 h-20 rounded-xl object-cover border border-gray-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = ''; 
                            e.target.style.display = 'none'; 
                            e.target.parentNode.querySelector('.fallback-image').style.display = 'flex'; // Show fallback
                          }}
                        />
                      ) : null}
                      <div 
                        className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-blue-200 fallback-image ${
                          medicine.imageUrl ? 'hidden' : 'flex'
                        }`}
                        style={{ display: medicine.imageUrl ? 'none' : 'flex' }}
                      >
                        <ImageIcon className="w-6 h-6 text-blue-400" />
                        <span className="text-[10px] text-blue-400 mt-1">No Image</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{medicine.name}</h3>
                      <p className="text-sm text-gray-500">{medicine.dosage}</p>
                      <p className="text-xs text-gray-400 mt-1">for {medicine.patientId?.name || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleToggleStatus(medicine)}
                      className="p-2 text-gray-500 hover:text-[#2d9134] hover:bg-green-50 rounded-lg transition-colors"
                      title="Toggle status"
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => navigate(`/editMedicine/${medicine._id}`)}
                      className="p-2 text-gray-500 hover:text-[#2d9134] hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Medicine details grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-xs font-medium text-gray-600">Timings</span>
                    </div>
                    <div className="space-y-1">
                      {medicine.timing?.map((time, index) => (
                        <div key={index} className="text-sm font-medium text-gray-700 bg-white px-2 py-1 rounded-lg border border-gray-100">
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-3 h-3 text-gray-500" />
                      <span className="text-xs font-medium text-gray-600">Purpose</span>
                    </div>
                    <div className="text-sm font-medium text-gray-700 bg-white px-2 py-1 rounded-lg border border-gray-100">
                      {medicine.purpose || 'Not specified'}
                    </div>
                    <div className="text-xs text-gray-500 mt-2 bg-white px-2 py-1 rounded-lg border border-gray-100">
                      {medicine.frequency}
                    </div>
                  </div>
                </div>

                {/* Instructions Card */}
                {medicine.instructions && (
                  <div className="bg-green-50 rounded-xl p-4 mb-4 border border-green-200">
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <span className="text-xs font-medium text-gray-500 block mb-1">Instructions</span>
                        <p className="text-sm text-gray-700 leading-relaxed">{medicine.instructions}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Bell className="w-3 h-3" />
                    <span>Last: {medicine.lastTaken || 'Not taken'}</span>
                  </div>
                  <StatusBadge status={medicine.status} />
                </div>
              </div>
            </div>
          ))}
          {medicines.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-200">
              No medicines found. Click "Add Medicine" to create one.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoutineManagement;