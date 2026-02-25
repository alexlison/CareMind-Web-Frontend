import React, { useEffect, useState } from 'react';
import { 
  Activity,
  AlertTriangle,
  TrendingUp,
  Pill,
  Coffee,
  Clock,
  Calendar,
  Users
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = "http://localhost:5000/api/caregiver";

const MonitoringManagement = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      fetchAllProfiles();
    }
  }, [token]);

  const fetchAllProfiles = async () => {
    try {
      setLoading(true);
      setError("");
      
      const patientsRes = await axios.post(
        `${API}/my-patients`,
        {},
        { headers: { 'token': token } }
      );
      
      if (patientsRes.data.status === "SUCCESS" && patientsRes.data.data.length > 0) {
        const patients = patientsRes.data.data;
        const profilesData = [];
        
        for (const patient of patients) {
          try {
            const profileRes = await axios.post(
              `${API}/reinforcement/Data`,
              { patientId: patient._id },
              { headers: { 'token': token } }
            );
            
            if (profileRes.data.status === "SUCCESS" && profileRes.data.data) {
              profilesData.push({
                patientId: patient._id,
                patientName: patient.name,
                patientRelationship: patient.relationship || 'Patient',
                ...profileRes.data.data
              });
            }
          } catch (err) {
            console.log("error->",err);
            console.log(`No profile for patient ${patient.name}`);
          }
        }
        
        setProfiles(profilesData);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to load monitoring data");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
        
        console.log("error->",e);
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d9134] mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading monitoring data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-[#2d9134] bg-opacity-10 p-2 rounded-lg">
          <Activity className="w-6 h-6 text-[#2d9134]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Monitoring</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your caregiving activities</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {profiles.length === 0 && !error && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <Activity className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500">No reinforcement profiles found</p>
          <p className="text-sm text-gray-400 mt-2">Profiles will be generated at midnight</p>
        </div>
      )}

      <div className="space-y-6">
        {profiles.map((profile) => (
          <div key={profile.patientId} className="bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-[#2d9134] bg-opacity-10 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-[#2d9134]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{profile.patientName}</h3>
                    <p className="text-sm text-gray-500">{profile.patientRelationship}</p>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full border ${getPriorityColor(profile.priorityLevel)}`}>
                  <span className="text-sm font-medium">
                   Prority Type : {profile.priorityLevel?.toUpperCase() || 'NORMAL'}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              {(!profile.dailyScores || profile.dailyScores.length === 0) ? (
                <div className="text-center py-8">
                  <AlertTriangle className="mx-auto h-8 w-8 text-yellow-400 mb-2" />
                  <p className="text-gray-600">No reinforcement data available yet</p>
                  <p className="text-sm text-gray-400 mt-1">Profile will be generated at midnight</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        <span className="text-sm text-gray-600">Weekly Avg</span>
                      </div>
                      <p className="text-2xl font-bold">{Math.round(profile.weeklyAverage || 0)}%</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-500 rounded-full h-2" 
                          style={{ width: `${profile.weeklyAverage || 0}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-white border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Pill className="w-5 h-5 text-red-500" />
                        <span className="text-sm text-gray-600">Medicine</span>
                      </div>
                      <p className="text-2xl font-bold">{Math.round(profile.medicineAverage || 0)}%</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-red-500 rounded-full h-2" 
                          style={{ width: `${profile.medicineAverage || 0}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-white border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Coffee className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-600">Routine</span>
                      </div>
                      <p className="text-2xl font-bold">{Math.round(profile.routineAverage || 0)}%</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-green-500 rounded-full h-2" 
                          style={{ width: `${profile.routineAverage || 0}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-white border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-purple-500" />
                        <span className="text-sm text-gray-600">Alert Interval</span>
                      </div>
                      <p className="text-2xl font-bold">{profile.alertInterval || 10} min</p>
                      <p className="text-xs text-gray-400 mt-2">Multiplier: {profile.alertMultiplier || 1}x</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white border rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">Medicine Miss Rate</p>
                      <p className="text-xl font-bold">{(profile.medicineMissRate * 100).toFixed(1)}%</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-red-500 rounded-full h-2" 
                          style={{ width: `${profile.medicineMissRate * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="bg-white border rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">Routine Miss Rate</p>
                      <p className="text-xl font-bold">{(profile.routineMissRate * 100).toFixed(1)}%</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-yellow-500 rounded-full h-2" 
                          style={{ width: `${profile.routineMissRate * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Problematic Items */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-5 h-5 text-orange-500" />
                        <h3 className="font-medium">Problematic Times</h3>
                      </div>
                      {profile.problematicTimes?.length > 0 ? (
                        <div className="space-y-2">
                          {profile.problematicTimes.map((time, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <span>{time.time}</span>
                              <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded">
                                {time.missCount} misses
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No problematic time slots</p>
                      )}
                    </div>

                    <div className="bg-white border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-5 h-5 text-orange-500" />
                        <h3 className="font-medium">Problematic Days</h3>
                      </div>
                      {profile.problematicDays?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profile.problematicDays.map((day, index) => (
                            <span key={index} className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm">
                              {day}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No problematic days</p>
                      )}
                    </div>

                    <div className="bg-white border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        <h3 className="font-medium">Problematic Tasks</h3>
                      </div>
                      {profile.problematicTaskTypes?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profile.problematicTaskTypes.map((type, index) => (
                            <span 
                              key={index} 
                              className={`px-3 py-1 rounded-full text-sm ${
                                type === 'Medicine' 
                                  ? 'bg-red-50 text-red-600' 
                                  : 'bg-orange-50 text-orange-600'
                              }`}
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No problematic task types</p>
                      )}
                    </div>
                  </div>

                  {profile.dailyScores?.length > 0 && (
                    <div className="bg-white border rounded-lg p-4">
                      <h3 className="font-medium mb-3">Daily Scores (Last 7 Days)</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Score</th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Progress</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {profile.dailyScores.map((day, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 text-sm">{formatDate(day.date)}</td>
                                <td className="px-4 py-2 text-sm">{Math.round(day.score)}%</td>
                                <td className="px-4 py-2">
                                  <div className="w-48 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-green-500 rounded-full h-2" 
                                      style={{ width: `${day.score}%` }}
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {profile.lastUpdated && (
                    <p className="text-xs text-gray-400 text-right mt-4">
                      Last Updated: {formatDate(profile.lastUpdated)}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonitoringManagement;