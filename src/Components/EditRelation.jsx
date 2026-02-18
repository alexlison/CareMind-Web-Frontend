import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  User,
  Upload,
  Heart,
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  Save,
  Loader,
  MapPin
} from "lucide-react";

const Field = ({ label, name, type = "text", required = true, value, error, onChange, disabled }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700 block text-left">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      className={`w-full rounded-xl border ${
        error ? "border-red-300" : "border-gray-300"
      } px-4 py-3 focus:ring-2 focus:ring-[#2d9134] focus:outline-none ${
        disabled ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    />
    {error && (
      <p className="text-xs text-red-600 text-left">{error}</p>
    )}
  </div>
);

const TextAreaField = ({ label, name, value, error, onChange }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700 block text-left">
      {label}
    </label>
    <textarea
      name={name}
      value={value || ""}
      onChange={onChange}
      rows="3"
      className={`w-full rounded-xl border ${
        error ? "border-red-300" : "border-gray-300"
      } px-4 py-3 focus:ring-2 focus:ring-[#2d9134] focus:outline-none`}
    />
    {error && (
      <p className="text-xs text-red-600 text-left">{error}</p>
    )}
  </div>
);

const EditRelation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = sessionStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    relation: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    alive: "Alive",
    notes: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: ""
  });

  const [errors, setErrors] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [originalPhoto, setOriginalPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRelation = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/caregiver/relationById/${id}`,
          { headers: { token } }
        );

        if (response.data.status === "SUCCESS") {
          const data = response.data.data;
          const address = data.address || {};
          
          setForm({
            name: data.name || "",
            relation: data.relation || "",
            phone: data.phone || "",
            email: data.email || "",
            dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : "",
            alive: data.alive || "Alive",
            notes: data.notes || "",
            street: address.street || "",
            city: address.city || "",
            state: address.state || "",
            country: address.country || "",
            pincode: address.pincode || ""
          });
          
          if (data.photo) {
            setPhotoPreview(`http://localhost:5000${data.photo}`);
            setOriginalPhoto(data.photo);
          }
        }
      } catch (error) {
        console.log("error->",error);
        alert("Failed to fetch relation");
      } finally {
        setLoading(false);
      }
    };
    fetchRelation();
  }, [id, token]);

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

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
    if (errors.photo) setErrors(prev => ({ ...prev, photo: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.relation.trim()) e.relation = "Relation is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      
      // Basic fields
      formData.append("name", form.name);
      formData.append("relation", form.relation);
      formData.append("alive", form.alive);
      if (form.phone) formData.append("phone", form.phone);
      if (form.email) formData.append("email", form.email);
      if (form.dateOfBirth) formData.append("dateOfBirth", form.dateOfBirth);
      if (form.notes) formData.append("notes", form.notes);
      
      const address = {};
      if (form.street) address.street = form.street;
      if (form.city) address.city = form.city;
      if (form.state) address.state = form.state;
      if (form.country) address.country = form.country;
      if (form.pincode) address.pincode = form.pincode;
      
      if (Object.keys(address).length > 0) {
        formData.append("address", JSON.stringify(address));
      }
      
      if (photoFile) formData.append("photo", photoFile);

      const response = await axios.put(
        `http://localhost:5000/api/caregiver/relationUpdate/${id}`,
        formData,
        { headers: { token, 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.status === "SUCCESS") {
        alert("Relation updated successfully!");
        navigate("/caregiverHome");
      } else {
        alert(response.data.message || "Failed to update");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg border p-12">
          <div className="flex flex-col items-center justify-center">
            <Loader className="w-12 h-12 text-[#2d9134] animate-spin" />
            <p className="mt-4 text-gray-600">Loading relation data...</p>
          </div>
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

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg border overflow-hidden"
      >
        <div className="bg-gradient-to-r from-[#2d9134] to-[#359a3a] p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl text-left font-bold">Edit Relation</h2>
              <p className="text-green-100 text-sm text-left">
                Update relation information
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <section className="border-b pb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#2d9134]" />
              Photo
            </h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className={`w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden
                ${errors.photo ? "border-red-300" : "border-gray-300"}`}>
                {photoPreview ? (
                  <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>

              <div>
                <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-xl transition-colors">
                  <Upload className="w-4 h-4" />
                  Change Photo
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handlePhotoChange}
                    accept="image/*"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">Max file size: 5MB</p>
                {originalPhoto && !photoFile && (
                  <p className="text-xs text-green-600 mt-1">Current photo will be kept</p>
                )}
              </div>
            </div>
            {errors.photo && (
              <p className="text-xs text-red-600 mt-2 text-left">{errors.photo}</p>
            )}
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#2d9134]" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field 
                label="Full Name" 
                name="name" 
                value={form.name}
                error={errors.name}
                onChange={handleChange}
              />
              
              <Field 
                label="Relation" 
                name="relation" 
                value={form.relation}
                error={errors.relation}
                onChange={handleChange}
                placeholder="e.g., brother, mother, friend"
              />

              <Field 
                label="Date of Birth" 
                name="dateOfBirth" 
                type="date"
                required={false}
                value={form.dateOfBirth}
                onChange={handleChange}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block text-left">
                  Status <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="alive"
                      value="Alive"
                      checked={form.alive === "Alive"}
                      onChange={handleChange}
                      className="text-[#2d9134] focus:ring-[#2d9134]"
                    />
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-green-600" />
                      Alive
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="alive"
                      value="Not Alive"
                      checked={form.alive === "Not Alive"}
                      onChange={handleChange}
                      className="text-[#2d9134] focus:ring-[#2d9134]"
                    />
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-gray-400" />
                      Not Alive
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          <section className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#2d9134]" />
              Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field 
                label="Phone" 
                name="phone" 
                type="tel"
                required={false}
                value={form.phone}
                error={errors.phone}
                onChange={handleChange}
              />
              <Field 
                label="Email" 
                name="email" 
                type="email"
                required={false}
                value={form.email}
                error={errors.email}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Address Section */}
          <section className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#2d9134]" />
              Address
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field 
                label="Street" 
                name="street" 
                required={false}
                value={form.street}
                onChange={handleChange}
              />
              <Field 
                label="City" 
                name="city" 
                required={false}
                value={form.city}
                onChange={handleChange}
              />
              <Field 
                label="State" 
                name="state" 
                required={false}
                value={form.state}
                onChange={handleChange}
              />
              <Field 
                label="Country" 
                name="country" 
                required={false}
                value={form.country}
                onChange={handleChange}
              />
              {/* Pincode - Full width */}
              <div className="md:col-span-2">
                <Field 
                  label="Pincode" 
                  name="pincode" 
                  required={false}
                  value={form.pincode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* Notes Section */}
          <section className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#2d9134]" />
              Additional Notes
            </h3>

            <TextAreaField 
              label="Notes (Optional)"
              name="notes"
              value={form.notes}
              error={errors.notes}
              onChange={handleChange}
            />
          </section>

          {/* Submit Button */}
          <div className="pt-6 border-t">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-[#2d9134] to-[#359a3a]
                         text-white py-3 rounded-xl font-semibold
                         hover:from-[#1B5E20] hover:to-[#2E7D32]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Update Relation
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditRelation;