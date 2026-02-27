import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Save,
  Loader,
  Shield
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
    {error && <p className="text-xs text-red-600 text-left">{error}</p>}
  </div>
);

const SelectField = ({ label, name, options, value, error, onChange }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700 block text-left">
      {label} <span className="text-red-500">*</span>
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className={`w-full rounded-xl border ${
        error ? "border-red-300" : "border-gray-300"
      } px-4 py-3 focus:ring-2 focus:ring-[#2d9134] focus:outline-none bg-white`}
    >
      <option value="">Select {label}</option>
      {options.map((o) => (
        <option key={o} value={o.toLowerCase()}>
          {o}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-red-600 text-left">{error}</p>}
  </div>
);

const PasswordField = ({ label, name, value, error, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 block text-left">
        {label} <span className="text-gray-500 text-xs">(Leave empty to keep current)</span>
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value || ""}
          onChange={onChange}
          className={`w-full rounded-xl border ${
            error ? "border-red-300" : "border-gray-300"
          } px-4 py-3 pr-12 focus:ring-2 focus:ring-[#2d9134] focus:outline-none`}
          placeholder="Enter new password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-600 text-left">{error}</p>}
    </div>
  );
};

const EditCaregiver = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState("");
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    street: "",
    city: "",
    state: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setFetchError("");
      
      try {
        const response = await axios.get(
          `http://localhost:5000/api/caregiver/Myprofile`,
          { headers: { token } }
        );

        if (response.data.status === "SUCCESS") {
          const profile = response.data.data;
          const address = profile.address || {};

          setForm({
            name: profile.name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            gender: profile.gender || "",
            street: address.street || "",
            city: address.city || "",
            state: address.state || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
          });
        } else {
          setFetchError(response.data.message || "Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setFetchError(error.response?.data?.message || "Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Full name is required";
    
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Enter a valid email address";

    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone))
      e.phone = "Phone must be 10 digits";

    if (!form.gender) e.gender = "Gender is required";

    if (!form.street.trim()) e.street = "Street is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state.trim()) e.state = "State is required";

    if (form.newPassword || form.confirmPassword) {
      if (!form.currentPassword) {
        e.currentPassword = "Current password is required to change password";
      }
      if (form.newPassword && form.newPassword.length < 6) {
        e.newPassword = "Password must be at least 6 characters";
      }
      if (form.newPassword !== form.confirmPassword) {
        e.confirmPassword = "Passwords do not match";
      }
    }

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
      const updateData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        gender: form.gender,
        address: {
          street: form.street,
          city: form.city,
          state: form.state
        }
      };

      if (form.currentPassword && form.newPassword) {
        updateData.currentPassword = form.currentPassword;
        updateData.newPassword = form.newPassword;
      }

      const response = await axios.put(
        `http://localhost:5000/api/caregiver/updateMyProfile`,
        updateData,
        { 
          headers: { 
            token,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data.status === "SUCCESS") {
        alert("Profile updated successfully!");
        
        if (form.name) {
          sessionStorage.setItem('userName', form.name);
        }
        
        navigate("/caregiverHome");
      } else {
        alert(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update error:", error);
      
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to update profile. Please try again.");
      }
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
            <p className="mt-4 text-gray-600">Loading profile data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg border p-12">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Profile</h3>
            <p className="text-gray-600 mb-6">{fetchError}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-[#2d9134] text-white rounded-lg hover:bg-[#1B5E20]"
            >
              Go Back
            </button>
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

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border overflow-hidden">
        <div className="bg-gradient-to-r from-[#2d9134] to-[#359a3a] p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl text-left font-bold">Edit Caregiver Profile</h2>
              <p className="text-green-100 text-sm text-left">
                Update your personal information
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
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
                label="Email" 
                name="email" 
                type="email"
                value={form.email}
                error={errors.email}
                onChange={handleChange}
              />
              <Field 
                label="Phone" 
                name="phone" 
                type="tel"
                value={form.phone}
                error={errors.phone}
                onChange={handleChange}
                maxLength="10"
              />
              <SelectField 
                label="Gender" 
                name="gender"
                options={["Male", "Female", "Other"]}
                value={form.gender}
                error={errors.gender}
                onChange={handleChange}
              />
            </div>
          </section>

          <section className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#2d9134]" />
              Address
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Field 
                label="Street" 
                name="street"
                value={form.street}
                error={errors.street}
                onChange={handleChange}
              />
              <Field 
                label="City" 
                name="city"
                value={form.city}
                error={errors.city}
                onChange={handleChange}
              />
              <Field 
                label="State" 
                name="state"
                value={form.state}
                error={errors.state}
                onChange={handleChange}
              />
            </div>
          </section>

          <section className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#2d9134]" />
              Change Password
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PasswordField
                label="Current Password"
                name="currentPassword"
                value={form.currentPassword}
                error={errors.currentPassword}
                onChange={handleChange}
              />
              <PasswordField
                label="New Password"
                name="newPassword"
                value={form.newPassword}
                error={errors.newPassword}
                onChange={handleChange}
              />
              <div className="md:col-span-2">
                <PasswordField
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  error={errors.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

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
                  Update Profile
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCaregiver;