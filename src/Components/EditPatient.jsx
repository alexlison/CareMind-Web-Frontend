import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  User,
  Upload,
  UserPlus,
  Activity,
  Bell,
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Loader
} from "lucide-react";

const Field = ({ label, name, type = "text", required = true, value, error, onChange, min, max, disabled }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700 block text-left">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      min={min}
      max={max}
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
      {error && (
        <p className="text-xs text-red-600 text-left">{error}</p>
      )}
    </div>
  );
};

const SelectField = ({ label, name, options, value, error, onChange, disabled }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700 block text-left">
      {label} <span className="text-red-500">*</span>
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      className={`w-full rounded-xl border ${
        error ? "border-red-300" : "border-gray-300"
      } px-4 py-3 focus:ring-2 focus:ring-[#2d9134] ${
        disabled ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    >
      <option value="">Select {label}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
    {error && (
      <p className="text-xs text-red-600 text-left">{error}</p>
    )}
  </div>
);

const EditPatient = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = sessionStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState("");
  
  const [form, setForm] = useState({
    name: "",
    nickName: "",
    email: "",
    password: "", 
    dob: "",
    gender: "",
    bloodGroup: "",
    qualification: "",
    street: "",
    city: "",
    state: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    emergencyEmail: "",
  });

  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const maxDate = yesterday.toISOString().split('T')[0];

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      
      setLoading(true);
      setFetchError("");
      
      try {
        const response = await axios.post(
          `http://localhost:5000/api/caregiver/${id}`,
          {},
          { headers: { token } }
        );

        if (response.data.status === "SUCCESS") {
          const patient = response.data.data;
          
          const personalDetails = patient.personalDetails || {};
          const address = patient.address || {};
          const emergencyContact = patient.emergencyContact || {};

          let formattedDob = "";
          if (personalDetails.dob) {
            const date = new Date(personalDetails.dob);
            formattedDob = date.toISOString().split('T')[0];
          }

          setForm({
            name: patient.name || "",
            nickName: patient.nickName || "",
            email: patient.email || "",
            password: "", 
            dob: formattedDob,
            gender: personalDetails.gender || "",
            bloodGroup: personalDetails.bloodGroup || "",
            qualification: personalDetails.highestQualification || "",
            street: address.street || "",
            city: address.city || "",
            state: address.state || "",
            emergencyName: emergencyContact.name || "",
            emergencyRelation: emergencyContact.relationship || "",
            emergencyPhone: emergencyContact.phone || "",
            emergencyEmail: emergencyContact.email || "",
          });

          if (patient.imageUrl) {
            setImagePreview(`http://localhost:5000${patient.imageUrl}`);
            setOriginalImage(patient.imageUrl);
          }
        } else {
          setFetchError(response.data.message || "Failed to fetch patient data");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setFetchError(error.response?.data?.message || "Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: "Please select an image file" }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: "Image size should be less than 5MB" }));
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Full name is required";
    
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Enter a valid email address";

    if (form.password && form.password.length < 6) {
      e.password = "Password must be at least 6 characters";
    }

    if (!form.dob) {
      e.dob = "Date of birth is required";
    } else {
      const selectedDate = new Date(form.dob);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate >= todayDate) {
        e.dob = "Today's date and future dates are not allowed";
      }
    }

    if (!form.gender) e.gender = "Gender is required";
    if (!form.bloodGroup) e.bloodGroup = "Blood group is required";
    if (!form.qualification.trim())
      e.qualification = "Qualification is required";

    if (!form.street.trim()) e.street = "Street is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state.trim()) e.state = "State is required";

    if (!form.emergencyName.trim())
      e.emergencyName = "Emergency contact name is required";
    if (!form.emergencyRelation.trim())
      e.emergencyRelation = "Relationship is required";

    if (!form.emergencyPhone.trim())
      e.emergencyPhone = "Emergency phone is required";
    else if (!/^\d{10}$/.test(form.emergencyPhone))
      e.emergencyPhone = "Phone must be 10 digits";

    if (!form.emergencyEmail.trim())
      e.emergencyEmail = "Emergency email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.emergencyEmail))
      e.emergencyEmail = "Enter a valid email address";

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

      formData.append("name", form.name);
      formData.append("nickName", form.nickName);
      formData.append("email", form.email);
      
      if (form.password) {
        formData.append("password", form.password);
      }

      formData.append(
        "personalDetails",
        JSON.stringify({
          dob: form.dob,
          gender: form.gender,
          bloodGroup: form.bloodGroup,
          highestQualification: form.qualification,
        })
      );

      formData.append(
        "address",
        JSON.stringify({
          street: form.street,
          city: form.city,
          state: form.state,
        })
      );

      formData.append(
        "emergencyContact",
        JSON.stringify({
          name: form.emergencyName,
          relationship: form.emergencyRelation,
          phone: form.emergencyPhone,
          email: form.emergencyEmail,
        })
      );

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await axios.put(
        `http://localhost:5000/api/caregiver/update/${id}`,
        formData,
        { 
          headers: { 
            token,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );

      if (response.data.status === "SUCCESS") {
        alert("Patient updated successfully!");
        navigate("/caregiverHome");
      } else {
        alert(response.data.message || "Failed to update patient");
      }
    } catch (error) {
      console.error("Update error:", error);
      
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to update patient. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ===== LOADING STATE =====
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg border p-12">
          <div className="flex flex-col items-center justify-center">
            <Loader className="w-12 h-12 text-[#2d9134] animate-spin" />
            <p className="mt-4 text-gray-600">Loading patient data...</p>
          </div>
        </div>
      </div>
    );
  }

  // ===== ERROR STATE =====
  if (fetchError) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg border p-12">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Patient</h3>
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

  // ===== MAIN RENDER =====
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-[#2d9134] mb-4 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2d9134] to-[#359a3a] p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl text-left font-bold">Edit Patient</h2>
              <p className="text-green-100 text-sm text-left">
                Update patient information
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-8">
          {/* Profile Picture Section */}
          <section className="border-b pb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#2d9134]" />
              Profile Picture
            </h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className={`w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden
                ${errors.image ? "border-red-300" : "border-gray-300"}`}>
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>

              <div>
                <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-xl transition-colors">
                  <Upload className="w-4 h-4" />
                  Change Image
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">Max file size: 5MB</p>
                {originalImage && !imageFile && (
                  <p className="text-xs text-green-600 mt-1">Current image will be kept</p>
                )}
              </div>
            </div>
            {errors.image && (
              <p className="text-xs text-red-600 mt-2 text-left">{errors.image}</p>
            )}
          </section>

          {/* Basic Information Section */}
          <section>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#2d9134]" />
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
                label="Nickname" 
                name="nickName" 
                required={false}
                value={form.nickName}
                error={errors.nickName}
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
              <PasswordField
                label="New Password" 
                name="password"
                value={form.password}
                error={errors.password}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Personal Details Section */}
          <section className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block text-left">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  max={maxDate} 
                  className={`w-full rounded-xl border ${
                    errors.dob ? "border-red-300" : "border-gray-300"
                  } px-4 py-3 focus:ring-2 focus:ring-[#2d9134] focus:outline-none`}
                />
                {errors.dob && (
                  <p className="text-xs text-red-600 text-left">{errors.dob}</p>
                )}
              </div>
              <SelectField
                label="Gender" 
                name="gender" 
                options={["Male", "Female", "Other"]}
                value={form.gender}
                error={errors.gender}
                onChange={handleChange}
              />
              <SelectField 
                label="Blood Group" 
                name="bloodGroup"
                options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                value={form.bloodGroup}
                error={errors.bloodGroup}
                onChange={handleChange}
              />
              <Field 
                label="Highest Qualification" 
                name="qualification"
                value={form.qualification}
                error={errors.qualification}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Address Section */}
          <section className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-4">Address</h3>
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

          {/* Emergency Contact Section */}
          <section className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#2d9134]" />
              Emergency Contact
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field 
                label="Contact Name" 
                name="emergencyName"
                value={form.emergencyName}
                error={errors.emergencyName}
                onChange={handleChange}
              />
              <Field 
                label="Relationship" 
                name="emergencyRelation"
                value={form.emergencyRelation}
                error={errors.emergencyRelation}
                onChange={handleChange}
              />
              <Field 
                label="Phone" 
                name="emergencyPhone"
                value={form.emergencyPhone}
                error={errors.emergencyPhone}
                onChange={handleChange}
                type="tel"
                maxLength="10"
              />
              <Field 
                label="Email" 
                name="emergencyEmail" 
                type="email"
                value={form.emergencyEmail}
                error={errors.emergencyEmail}
                onChange={handleChange}
              />
            </div>
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
                  Update Patient
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditPatient;