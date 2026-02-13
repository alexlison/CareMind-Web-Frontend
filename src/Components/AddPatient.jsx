import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Upload,
  UserPlus,
  Activity,
  Bell,
  ArrowLeft
} from "lucide-react";

const AddPatient = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

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
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Enter a valid email address";

    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6)
      e.password = "Password must be at least 6 characters";

    if (!form.dob) e.dob = "Date of birth is required";
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

    if (!image) e.image = "Profile image is required";

    return e;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();

      fd.append("name", form.name);
      fd.append("nickName", form.nickName); // optional
      fd.append("email", form.email);
      fd.append("password", form.password);

      fd.append(
        "personalDetails",
        JSON.stringify({
          dob: form.dob,
          gender: form.gender,
          bloodGroup: form.bloodGroup,
          highestQualification: form.qualification,
        })
      );

      fd.append(
        "address",
        JSON.stringify({
          street: form.street,
          city: form.city,
          state: form.state,
        })
      );

      fd.append(
        "emergencyContact",
        JSON.stringify({
          name: form.emergencyName,
          relationship: form.emergencyRelation,
          phone: form.emergencyPhone,
          email: form.emergencyEmail,
        })
      );

      fd.append("image", image);

      const res = await axios.post(
        "http://localhost:5000/api/caregiver/add",
        fd,
        { headers: { token } }
      );

      if (res.data.status === "SUCCESS") {
        navigate("/caregiver/home");
      } else {
        alert(res.data.message || "Failed to add patient");
      }
    } catch {
      alert("Failed to add patient");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI HELPERS ================= */
  const Field = ({ label, name, type = "text", required = true }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        className={`w-full rounded-xl border ${
          errors[name] ? "border-red-300" : "border-gray-300"
        } px-4 py-3 focus:ring-2 focus:ring-[#2d9134] focus:outline-none`}
      />
      {errors[name] && (
        <p className="text-xs text-red-600">{errors[name]}</p>
      )}
    </div>
  );

  const SelectField = ({ label, name, options }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <select
        name={name}
        value={form[name]}
        onChange={handleChange}
        className={`w-full rounded-xl border ${
          errors[name] ? "border-red-300" : "border-gray-300"
        } px-4 py-3 focus:ring-2 focus:ring-[#2d9134]`}
      >
        <option value="">Select {label}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {errors[name] && (
        <p className="text-xs text-red-600">{errors[name]}</p>
      )}
    </div>
  );

  /* ================= RENDER ================= */
  return (
    <div className="max-w-3xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate("/caregiver/home")}
        className="flex items-center gap-2 text-gray-600 hover:text-[#2d9134] mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg border overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2d9134] to-[#359a3a] p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Patient Registration</h2>
              <p className="text-green-100 text-sm">
                All fields are mandatory except Nickname
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Profile */}
          <section className="border-b pb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#2d9134]" />
              Profile Picture <span className="text-red-500">*</span>
            </h3>

            <div className="flex items-center gap-6">
              <div className={`w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden
                ${errors.image ? "border-red-300" : "border-gray-300"}`}>
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>

              <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 px-6 py-3 rounded-xl">
                <Upload className="w-4 h-4" />
                Choose Image
                <input type="file" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
            {errors.image && (
              <p className="text-xs text-red-600 mt-2">{errors.image}</p>
            )}
          </section>

          {/* BASIC */}
          <section>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#2d9134]" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Full Name" name="name" />
              <Field label="Nickname (Optional)" name="nickName" required={false} />
              <Field label="Email" name="email" type="email" />
              <Field label="Password" name="password" type="password" />
            </div>
          </section>

          {/* PERSONAL */}
          <section className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Date of Birth" name="dob" type="date" />
              <SelectField label="Gender" name="gender" options={["Male","Female","Other"]} />
              <SelectField label="Blood Group" name="bloodGroup"
                options={["A+","A-","B+","B-","AB+","AB-","O+","O-"]} />
              <Field label="Highest Qualification" name="qualification" />
            </div>
          </section>

          {/* ADDRESS */}
          <section className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-4">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Field label="Street" name="street" />
              <Field label="City" name="city" />
              <Field label="State" name="state" />
            </div>
          </section>

          {/* EMERGENCY */}
          <section className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#2d9134]" />
              Emergency Contact
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Contact Name" name="emergencyName" />
              <Field label="Relationship" name="emergencyRelation" />
              <Field label="Phone" name="emergencyPhone" />
              <Field label="Email" name="emergencyEmail" type="email" />
            </div>
          </section>

          {/* ACTION */}
          <div className="pt-6 border-t">
            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#2d9134] to-[#359a3a]
                         text-white py-3 rounded-xl font-semibold
                         hover:from-[#1B5E20] hover:to-[#2E7D32]
                         disabled:opacity-50"
            >
              {loading ? "Adding Patient..." : "Add Patient"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPatient;
