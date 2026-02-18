import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Activity, 
  ArrowLeft,
  User
} from 'lucide-react';

const AddRoutine = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const [form, setForm] = useState({
    title: '',
    type: 'exercise',
    scheduledTime: '',
    frequency: '',
    description: '',
    patientId: ''
  });
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch patients for dropdown
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
      } finally {
        setLoadingPatients(false);
      }
    };
    if (token) fetchPatients();
  }, [token]);

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
    if (!form.patientId) e.patientId = "Please select a patient";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/caregiver/addRoutine", 
        form, 
        { headers: { token } }
      );
      if (res.data.status === "SUCCESS") {
        alert("Routine added successfully!");
        navigate("/caregiverHome");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add routine");
    } finally {
      setSubmitting(false);
    }
  };

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
              <h2 className="text-xl font-bold">Add New Routine</h2>
              <p className="text-green-100 text-sm">Create a new routine for patient</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Patient Selection Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block text-left">
              Select Patient <span className="text-red-500">*</span>
            </label>
            <select
              name="patientId"
              value={form.patientId}
              onChange={handleChange}
              className={`w-full rounded-xl border ${errors.patientId ? "border-red-300" : "border-gray-300"} px-4 py-3 focus:ring-2 focus:ring-[#2d9134]`}
            >
              <option value="">-- Choose a patient --</option>
              {loadingPatients ? (
                <option disabled>Loading patients...</option>
              ) : (
                patients.filter(p => p.isActive).map(patient => (
                  <option key={patient._id} value={patient._id}>
                    {patient.name} {patient.nickName ? `(${patient.nickName})` : ''}
                  </option>
                ))
              )}
            </select>
            {errors.patientId && <p className="text-xs text-red-600 text-left">{errors.patientId}</p>}
            {!loadingPatients && patients.length === 0 && (
              <p className="text-xs text-amber-600 text-left">No active patients found. Please add a patient first.</p>
            )}
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
              placeholder="e.g., Morning Walk"
              className={`w-full rounded-xl border ${errors.title ? "border-red-300" : "border-gray-300"} px-4 py-3 focus:ring-2 focus:ring-[#2d9134]`}
            />
            {errors.title && <p className="text-xs text-red-600 text-left">{errors.title}</p>}
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
                placeholder="e.g., 07:00 AM"
                className={`w-full rounded-xl border ${errors.scheduledTime ? "border-red-300" : "border-gray-300"} px-4 py-3 focus:ring-2 focus:ring-[#2d9134]`}
              />
              {errors.scheduledTime && <p className="text-xs text-red-600 text-left">{errors.scheduledTime}</p>}
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
                placeholder="e.g., Daily"
                className={`w-full rounded-xl border ${errors.frequency ? "border-red-300" : "border-gray-300"} px-4 py-3 focus:ring-2 focus:ring-[#2d9134]`}
              />
              {errors.frequency && <p className="text-xs text-red-600 text-left">{errors.frequency}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block text-left">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter routine description..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#2d9134]"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting || patients.length === 0}
              className="w-full bg-gradient-to-r from-[#2d9134] to-[#359a3a] text-white py-3 rounded-xl font-semibold hover:from-[#1B5E20] hover:to-[#2E7D32] disabled:opacity-50"
            >
              {submitting ? "Adding Routine..." : "Add Routine"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRoutine;