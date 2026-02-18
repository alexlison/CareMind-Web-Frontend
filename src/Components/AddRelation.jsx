import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Upload, Heart, ArrowLeft, Mail, Phone, FileText, UserPlus, MapPin, Loader } from "lucide-react";

const Field = ({ label, name, type = "text", required, value, error, onChange, placeholder, max }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700 block text-left">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      max={max}
      className={`w-full rounded-xl border ${error ? "border-red-300" : "border-gray-300"} px-4 py-3 focus:ring-2 focus:ring-[#2d9134] focus:outline-none`}
    />
    {error && <p className="text-xs text-red-600 text-left">{error}</p>}
  </div>
);

const AddRelation = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const maxDate = yesterday.toISOString().split('T')[0];

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [form, setForm] = useState({
    name: "", relation: "", phone: "", email: "", dateOfBirth: "", alive: "Alive", notes: "",
    street: "", city: "", state: "", country: "", pincode: ""
  });
  const [errors, setErrors] = useState({});
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.post("http://localhost:5000/api/caregiver/my-patients", {}, { headers: { token } })
      .then(res => {
        if (res.data.status === "SUCCESS") {
          setPatients(res.data.data || []);
          const activePatient = res.data.data.find(p => p.isActive);
          if (activePatient) setSelectedPatientId(activePatient._id);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, photo: "Please select an image file" }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: "Image size should be less than 5MB" }));
      return;
    }

    setPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
    if (errors.photo) setErrors(prev => ({ ...prev, photo: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name required";
    if (!form.relation.trim()) e.relation = "Relation required";
    if (!selectedPatientId) e.patientId = "Select patient";
    if (!photo) e.photo = "Photo required";
    
    if (!form.phone.trim()) e.phone = "Phone required";
    else if (!/^\d{10}$/.test(form.phone)) e.phone = "10 digits required";
    
    if (!form.email.trim()) e.email = "Email required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    
    if (!form.dateOfBirth) {
      e.dateOfBirth = "DOB required";
    } else {
      const selected = new Date(form.dateOfBirth);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selected.setHours(0, 0, 0, 0);
      
      if (selected >= today) {
        e.dateOfBirth = "Future dates and today's date are not allowed";
      }
    }
    
    if (!form.street.trim()) e.street = "Street required";
    if (!form.city.trim()) e.city = "City required";
    if (!form.state.trim()) e.state = "State required";
    if (!form.country.trim()) e.country = "Country required";
    
    if (!form.pincode.trim()) e.pincode = "Pincode required";
    else if (!/^\d{6}$/.test(form.pincode)) e.pincode = "6 digits required";
    
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      window.scrollTo(0, 0);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'notes') {
          if (form.notes) formData.append(key, form[key]);
        } else {
          formData.append(key, form[key]);
        }
      });
      formData.append("patientId", selectedPatientId);
      formData.append("address", JSON.stringify({
        street: form.street, city: form.city, state: form.state,
        country: form.country, pincode: form.pincode
      }));
      formData.append("photo", photo);

      const res = await axios.post("http://localhost:5000/api/caregiver/addRelation", formData, {
        headers: { token, 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.status === "SUCCESS") {
        alert("Relation added!");
        navigate("/caregiverHome");
      } else alert(res.data.message || "Failed");
    } catch (error) {
      alert(error.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl shadow-lg border p-12 flex justify-center">
        <Loader className="w-12 h-12 text-[#2d9134] animate-spin" />
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-[#2d9134] mb-4">
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border overflow-hidden">
        <div className="bg-gradient-to-r from-[#2d9134] to-[#359a3a] p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Add New Relation</h2>
              <p className="text-green-100 text-sm">Add a familiar person for the patient</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <section className="border-b pb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#2d9134]" /> Photo <span className="text-red-500">*</span>
            </h3>
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className={`w-24 h-24 rounded-full border-2 border-dashed overflow-hidden ${errors.photo ? "border-red-300" : "border-gray-300"}`}>
                {photoPreview ? <img src={photoPreview} className="w-full h-full object-cover" /> : <User className="w-12 h-12 text-gray-400 m-6" />}
              </div>
              <div>
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-xl inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Choose Photo
                  <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
                </label>
                <p className="text-xs text-gray-500 mt-2">Max 5MB</p>
              </div>
            </div>
            {errors.photo && <p className="text-xs text-red-600 mt-2">{errors.photo}</p>}
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#2d9134]" /> Patient Information
            </h3>
            <select value={selectedPatientId} onChange={(e) => setSelectedPatientId(e.target.value)}
              className={`w-full rounded-xl border ${errors.patientId ? "border-red-300" : "border-gray-300"} px-4 py-3 focus:ring-2 focus:ring-[#2d9134]`}>
              <option value="">Select patient</option>
              {patients.map(p => <option key={p._id} value={p._id}>{p.name} {p.isActive ? '(Active)' : ''}</option>)}
            </select>
            {errors.patientId && <p className="text-xs text-red-600 mt-1">{errors.patientId}</p>}
          </section>

          <section className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><User className="w-5 h-5 text-[#2d9134]" /> Basic Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Name" name="name" value={form.name} error={errors.name} onChange={handleChange} required />
              <Field label="Relation" name="relation" value={form.relation} error={errors.relation} onChange={handleChange} required placeholder="brother, mother, etc" />
              <Field label="DOB" name="dateOfBirth" type="date" value={form.dateOfBirth} error={errors.dateOfBirth} onChange={handleChange} required max={maxDate} />
              <div>
                <label className="text-sm font-medium text-gray-700">Status *</label>
                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="alive" value="Alive" checked={form.alive === "Alive"} onChange={handleChange} className="text-[#2d9134]" />
                    <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-green-600" /> Alive</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="alive" value="Not Alive" checked={form.alive === "Not Alive"} onChange={handleChange} className="text-[#2d9134]" />
                    <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-gray-400" /> Not Alive</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          <section className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Mail className="w-5 h-5 text-[#2d9134]" /> Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Phone" name="phone" value={form.phone} error={errors.phone} onChange={handleChange} required placeholder="10 digits" />
              <Field label="Email" name="email" type="email" value={form.email} error={errors.email} onChange={handleChange} required placeholder="email@example.com" />
            </div>
          </section>

          <section className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-[#2d9134]" /> Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Street" name="street" value={form.street} error={errors.street} onChange={handleChange} required />
              <Field label="City" name="city" value={form.city} error={errors.city} onChange={handleChange} required />
              <Field label="State" name="state" value={form.state} error={errors.state} onChange={handleChange} required />
              <Field label="Country" name="country" value={form.country} error={errors.country} onChange={handleChange} required />
              <div className="md:col-span-2">
                <Field label="Pincode" name="pincode" value={form.pincode} error={errors.pincode} onChange={handleChange} required placeholder="6 digits" />
              </div>
            </div>
          </section>

          <section className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-[#2d9134]" /> Notes (Optional)</h3>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows="3"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#2d9134]" />
          </section>

          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-[#2d9134] to-[#359a3a] text-white py-3 rounded-xl font-semibold hover:from-[#1B5E20] hover:to-[#2E7D32] disabled:opacity-50">
            {loading ? "Adding..." : "Add Relation"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRelation;