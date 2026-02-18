import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Activity, 
  ArrowLeft,
  Save,
  Loader
} from 'lucide-react';


// const API = "http://localhost:5000/api/caregiver";

const UpdateRoutine = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = sessionStorage.getItem("token");

  const [form, setForm] = useState({
    title: '',
    type: 'exercise',
    scheduledTime: '',
    frequency: '',
    description: ''
  });
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/caregiver/my-patients",
          {},
          { headers: { token } }
        );
        if (res.data.status === "SUCCESS") {
          setPatients(res.data.data);
        }
      } catch (error) {
        console.log("error->",error);
        console.error("Failed to fetch patients");
      }
    };
    if (token) fetchPatients();
  }, [token]);

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/caregiver/routineById/${id}`,
          { headers: { token } }
        );
        
        if (res.data.status === "SUCCESS") {
          const routine = res.data.data;
          setForm({
            title: routine.title || '',
            type: routine.type || 'exercise',
            scheduledTime: routine.scheduledTime || '',
            frequency: routine.frequency || '',
            description: routine.description || ''
          });
          if (routine.patientId) {
            setSelectedPatient(routine.patientId._id || routine.patientId);
          }
        }
      } catch (error) {
        console.log("Error->", error);
        setFetchError("Failed to fetch routine details");
      } finally {
        setLoading(false);
      }
    };
    
    if (token && id) {
      fetchRoutine();
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.scheduledTime.trim()) e.scheduledTime = "Scheduled time is required";
    if (!form.frequency.trim()) e.frequency = "Frequency is required";
    if (!selectedPatient) e.patientId = "Please select a patient";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const submitData = {
      ...form,
      patientId: selectedPatient
    };

    setSubmitting(true);
    try {
      const res = await axios.put(
        `http://localhost:5000/api/caregiver/routineUpdate/${id}`,
        submitData,
        { headers: { token } }
      );
      
      if (res.data.status === "SUCCESS") {
        alert("Routine updated successfully!");
        navigate("/routineManagement");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update routine");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg border p-12">
          <div className="flex flex-col items-center">
            <Loader className="w-12 h-12 text-[#2d9134] animate-spin" />
            <p className="mt-4 text-gray-600">Loading routine...</p>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg border p-12 text-center">
          <p className="text-red-600 mb-4">{fetchError}</p>
          <button onClick={() => navigate(-1)} className="px-6 py-2 bg-[#2d9134] text-white rounded-lg">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-[#2d9134] mb-4 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border overflow-hidden">
        <div className="bg-gradient-to-r from-[#2d9134] to-[#359a3a] p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Update Routine</h2>
              <p className="text-green-100 text-sm">Edit routine details</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block text-left">
              Select Patient <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className={`w-full rounded-xl border ${errors.patientId ? "border-red-300" : "border-gray-300"} px-4 py-3 focus:ring-2 focus:ring-[#2d9134]`}
            >
              <option value="">-- Choose a patient --</option>
              {patients.filter(p => p.isActive).map(patient => (
                <option key={patient._id} value={patient._id}>
                  {patient.name} {patient.nickName ? `(${patient.nickName})` : ''}
                </option>
              ))}
            </select>
            {errors.patientId && <p className="text-xs text-red-600 text-left">{errors.patientId}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block text-left">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className={`w-full rounded-xl border ${errors.title ? "border-red-300" : "border-gray-300"} px-4 py-3 focus:ring-2 focus:ring-[#2d9134]`}
            />
            {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block text-left">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#2d9134]"
            >
              <option value="exercise">Exercise</option>
              <option value="meal">Meal</option>
              <option value="therapy">Therapy</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block text-left">
                Scheduled Time <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="scheduledTime"
                value={form.scheduledTime}
                onChange={handleChange}
                className={`w-full rounded-xl border ${errors.scheduledTime ? "border-red-300" : "border-gray-300"} px-4 py-3 focus:ring-2 focus:ring-[#2d9134]`}
              />
              {errors.scheduledTime && <p className="text-xs text-red-600">{errors.scheduledTime}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block text-left">
                Frequency <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="frequency"
                value={form.frequency}
                onChange={handleChange}
                className={`w-full rounded-xl border ${errors.frequency ? "border-red-300" : "border-gray-300"} px-4 py-3 focus:ring-2 focus:ring-[#2d9134]`}
              />
              {errors.frequency && <p className="text-xs text-red-600">{errors.frequency}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block text-left">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#2d9134]"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-[#2d9134] to-[#359a3a] text-white py-3 rounded-xl font-semibold hover:from-[#1B5E20] hover:to-[#2E7D32] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? <><Loader className="w-5 h-5 animate-spin" /> Updating...</> : <><Save className="w-5 h-5" /> Update Routine</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateRoutine;