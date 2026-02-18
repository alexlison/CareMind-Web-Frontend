import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Pill, 
  Upload,
  Image as ImageIcon,
  ArrowLeft,
  Save,
  Loader
} from 'lucide-react';

const UpdateMedicine = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = sessionStorage.getItem("token");

  const [form, setForm] = useState({
    name: '',
    dosage: '',
    frequency: '',
    timing: [''],
    purpose: '',
    instructions: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/caregiver/medicineById/${id}`,  
          { headers: { token } }
        );
        if (res.data.status === "SUCCESS") {
          const medicine = res.data.data;
          setForm({
            name: medicine.name || '',
            dosage: medicine.dosage || '',
            frequency: medicine.frequency || '',
            timing: medicine.timing || [''],
            purpose: medicine.purpose || '',
            instructions: medicine.instructions || ''
          });
          if (medicine.imageUrl) {
            setImagePreview(`http://localhost:5000${medicine.imageUrl}`);
            setOriginalImage(medicine.imageUrl);
          }
        }
      } catch (error) {
        console.log("Error->",error);
        setFetchError("Failed to fetch medicine details");
      } finally {
        setLoading(false);
      }
    };
    if (token && id) fetchMedicine();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleTimingChange = (index, value) => {
    const newTiming = [...form.timing];
    newTiming[index] = value;
    setForm({ ...form, timing: newTiming });
  };

  const addTiming = () => {
    setForm({ ...form, timing: [...form.timing, ''] });
  };

  const removeTiming = (index) => {
    if (form.timing.length > 1) {
      setForm({ ...form, timing: form.timing.filter((_, i) => i !== index) });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, image: "Please select an image file" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, image: "Image size should be less than 5MB" });
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    if (errors.image) setErrors({ ...errors, image: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Medicine name is required";
    if (!form.dosage.trim()) e.dosage = "Dosage is required";
    if (!form.frequency.trim()) e.frequency = "Frequency is required";
    if (!form.timing.some(t => t.trim())) e.timing = "At least one timing is required";
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
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('dosage', form.dosage);
    formData.append('frequency', form.frequency);
    formData.append('timing', JSON.stringify(form.timing.filter(t => t.trim())));
    formData.append('purpose', form.purpose);
    formData.append('instructions', form.instructions);
    if (image) formData.append('image', image);

    try {
      const res = await axios.put(
        `http://localhost:5000/api/caregiver/medicineUpdate/${id}`, 
        formData, 
        { headers: { token, 'Content-Type': 'multipart/form-data' } }
      );
      if (res.data.status === "SUCCESS") {
        alert("Medicine updated successfully!");
        navigate("/caregiverHome");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update medicine");
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
            <p className="mt-4 text-gray-600">Loading medicine...</p>
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
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Update Medicine</h2>
              <p className="text-green-100 text-sm">Edit medicine details</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#2d9134]" />
              Medicine Image
            </h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className={`w-24 h-24 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden ${errors.image ? "border-red-300" : "border-gray-300"}`}>
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div>
                <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-xl transition-colors">
                  <Upload className="w-4 h-4" />
                  Change Image
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
                <p className="text-xs text-gray-500 mt-2">Max file size: 5MB</p>
                {originalImage && !image && (
                  <p className="text-xs text-green-600 mt-1">Current image will be kept</p>
                )}
              </div>
            </div>
            {errors.image && <p className="text-xs text-red-600 mt-2">{errors.image}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block text-left">
              Medicine Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full rounded-xl border ${errors.name ? "border-red-300" : "border-gray-300"} px-4 py-3 focus:ring-2 focus:ring-[#2d9134]`}
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block text-left">
                Dosage <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="dosage"
                value={form.dosage}
                onChange={handleChange}
                className={`w-full rounded-xl border ${errors.dosage ? "border-red-300" : "border-gray-300"} px-4 py-3 focus:ring-2 focus:ring-[#2d9134]`}
              />
              {errors.dosage && <p className="text-xs text-red-600">{errors.dosage}</p>}
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
            <label className="text-sm font-medium text-gray-700 block text-left">
              Timings <span className="text-red-500">*</span>
            </label>
            {form.timing.map((time, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Time ${index + 1}`}
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#2d9134]"
                  value={time}
                  onChange={(e) => handleTimingChange(index, e.target.value)}
                />
                {form.timing.length > 1 && (
                  <button type="button" onClick={() => removeTiming(index)} className="px-4 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200">×</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addTiming} className="text-sm text-[#2d9134] hover:underline mt-2">
              + Add another time
            </button>
            {errors.timing && <p className="text-xs text-red-600">{errors.timing}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block text-left">Purpose</label>
            <input
              type="text"
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#2d9134]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block text-left">Instructions</label>
            <textarea
              name="instructions"
              value={form.instructions}
              onChange={handleChange}
              rows="3"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#2d9134]"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-[#2d9134] to-[#359a3a] text-white py-3 rounded-xl font-semibold hover:from-[#1B5E20] hover:to-[#2E7D32] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? <><Loader className="w-5 h-5 animate-spin" /> Updating...</> : <><Save className="w-5 h-5" /> Update Medicine</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateMedicine;