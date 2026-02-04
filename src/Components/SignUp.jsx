import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { BrainCircuit, Eye, EyeOff, X } from 'lucide-react';


const SignUp = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('');

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        gender: '',
        address: {
            street: '',
            city: '',
            state: ''
        }
    });

    const [errors, setErrors] = useState({});

    const showPopupAlert = (type, msg) => {
        setPopupType(type);
        setPopupMessage(msg);
        setShowPopup(true);

        setTimeout(() => {
            setShowPopup(false);
        }, 5000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setForm(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value
            }));
        }

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        if (!form.name.trim()) {
            newErrors.name = "Full name is required";
        }

        if (!form.email.trim()) {
            newErrors.email = "Email address is required";
        } else if (!emailRegex.test(form.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!form.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!phoneRegex.test(form.phone)) {
            newErrors.phone = "Please enter a valid 10-digit phone number";
        }

        if (!form.gender) {
            newErrors.gender = "Gender is required";
        }

        if (!form.password) {
            newErrors.password = "Password is required";
        } else if (form.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!form.address.street.trim()) {
            newErrors.street = "Street address is required";
        }

        if (!form.address.city.trim()) {
            newErrors.city = "City is required";
        }

        if (!form.address.state.trim()) {
            newErrors.state = "State is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setShowPopup(false);

        if (!validate()) {
            setMessage('Please fill all required fields correctly');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/api/auth/register/caregiver", {
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                password: form.password,
                gender: form.gender,
                address: {
                    street: form.address.street.trim(),
                    city: form.address.city.trim(),
                    state: form.address.state.trim()
                }
            });

            if (response.status === 201) {
                showPopupAlert('success', 'Registration successful! You will be redirected to login page.');

                setForm({
                    name: '',
                    email: '',
                    phone: '',
                    password: '',
                    gender: '',
                    address: {
                        street: '',
                        city: '',
                        state: ''
                    }
                });

                setErrors({});

                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }

        } catch (error) {
            console.error('Registration error:', error);

            if (error.response) {
                const errorData = error.response.data;

                if (error.response.status === 409) {
                    if (errorData.message?.includes("Email")) {
                        showPopupAlert('Warning', 'Email already exists. Please use a different email address.');
                        setErrors(prev => ({ ...prev, email: "This email is already registered" }));
                    } else if (errorData.message?.includes("Phone")) {
                        showPopupAlert('Warning', 'Phone number already exists. Please use a different phone number.');
                        setErrors(prev => ({ ...prev, phone: "This phone number is already registered" }));
                    } else {
                        showPopupAlert('Warning', errorData.message || "Registration failed");
                    }
                } else if (error.response.status === 400) {
                    showPopupAlert('Warning', "Invalid data. Please check all fields");
                } else {
                    showPopupAlert('Warning', errorData.message || "Registration failed. Please try again.");
                }
            } else if (error.request) {
                showPopupAlert('error', "Network error. Please check your connection.");
            } else {
                showPopupAlert('error', "An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen  flex items-center justify-center p-4 relative">
            {/* Popup */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`relative max-w-md w-full rounded-2xl shadow-2xl transform transition-all duration-300 ${popupType === 'success' ? 'animate-fadeIn' : 'animate-bounceIn'}`}>
                        <div className={`rounded-2xl overflow-hidden ${popupType === 'success' ? 'bg-gradient-to-br from-green-50 to-emerald-100' : 'bg-gradient-to-br from-red-50 to-rose-100'}`}>
                            <div className={`p-6 ${popupType === 'success' ? 'bg-gradient-to-r from-[#249f2c] to-[#2d9134]' : 'bg-gradient-to-r from-red-500 to-red-600'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-full ${popupType === 'success' ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center`}>
                                            {popupType === 'success' ? (
                                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            ) : (
                                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                </svg>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-white">
                                            {popupType === 'success' ? 'Success!' : 'Error!'}
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setShowPopup(false)}
                                        className="text-white hover:text-gray-200 transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-8">
                                <p className={`text-lg font-medium ${popupType === 'success' ? 'text-gray-800' : 'text-gray-800'} mb-6`}>
                                    {popupMessage}
                                </p>

                                <div className="flex justify-center">
                                    <button
                                        onClick={() => setShowPopup(false)}
                                        className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${popupType === 'success'
                                            ? 'bg-gradient-to-r from-[#249f2c] to-[#2d9134] text-white hover:shadow-lg'
                                            : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg'}`}
                                    >
                                        {popupType === 'success' ? 'Continue' : 'Try Again'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-3xl">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E8F5E9] shadow mb-4">
                        <BrainCircuit className="w-8 h-8 text-[#2E7D32]" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Care<span className="font-light ps-1">Mind</span>
                    </h1>
                    <p className="text-gray-600 mt-2">Caregiver Registration</p>
                </div>

                <div className="bg-white rounded-3xl  border-2 border-lime-700 border-opacity-10 shadow-xl p-8 px-10">
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg text-center font-medium ${message.startsWith("success:")
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {message.split(":")[1]}
                        </div>
                    )}

                    <h2 className="text-2xl font-bold text-gray-800 mb-10">Create Account</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-left ps-2  font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#249f2c] focus:border-transparent outline-none`}
                                    placeholder="John Doe"
                                />
                                {errors.name && <p className="text-red-500 text-sm text-left ps-2 mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm text-left ps-2 font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#249f2c] focus:border-transparent outline-none`}
                                    placeholder="john@example.com"
                                />
                                {errors.email && <p className="text-red-500 text-sm text-left ps-2 mt-1">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-left ps-2 font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    maxLength="10"
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#249f2c] focus:border-transparent outline-none`}
                                    placeholder="9876543210"
                                />
                                {errors.phone && <p className="text-red-500 text-sm text-left ps-2 mt-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm text-left ps-2 font-medium text-gray-700 mb-1">
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.gender ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#249f2c] focus:border-transparent outline-none text-gray-900`}
                                >
                                    <option value="" disabled className="text-gray-400">Select Gender</option>
                                    <option value="Male" className="text-gray-900">Male</option>
                                    <option value="Female" className="text-gray-900">Female</option>
                                    <option value="Other" className="text-gray-900">Other</option>
                                </select>
                                {errors.gender && <p className="text-red-500 text-sm text-left ps-2 mt-1">{errors.gender}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4"> </div>

                        <div>
                            <label className="block text-sm text-left ps-2  font-medium text-gray-700 mb-1">
                                Street Address
                            </label>
                            <input
                                type="text"
                                name="address.street"
                                value={form.address.street}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.street ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#249f2c] focus:border-transparent outline-none`}
                                placeholder="123 Main Street"
                            />
                            {errors.street && <p className="text-red-500 text-sm text-left ps-2 mt-1">{errors.street}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-left ps-2  font-medium text-gray-700 mb-1">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="address.city"
                                    value={form.address.city}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.city ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#249f2c] focus:border-transparent outline-none`}
                                    placeholder="New York"
                                />
                                {errors.city && <p className="text-red-500 text-sm text-left ps-2 mt-1">{errors.city}</p>}
                            </div>

                            <div>
                                <label className="block text-sm text-left ps-2  font-medium text-gray-700 mb-1">
                                    State
                                </label>
                                <input
                                    type="text"
                                    name="address.state"
                                    value={form.address.state}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.state ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#249f2c] focus:border-transparent outline-none`}
                                    placeholder="NY"
                                />
                                {errors.state && <p className="text-red-500 text-sm text-left ps-2 mt-1">{errors.state}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-left ps-2 font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#249f2c] focus:border-transparent outline-none pr-12`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm text-left ps-2 mt-1">{errors.password}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#249f2c] to-[#2d9134] text-white font-semibold rounded-lg hover:from-[#1e8a26] hover:to-[#25802b] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg mt-4"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[#249f2c] font-semibold hover:underline">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <Link to="/" className="text-gray-500 hover:text-gray-700 inline-flex items-center text-sm">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Homepage
                    </Link>
                </div>

                <p className="text-center text-gray-400 text-xs mt-4">
                    © 2025 CareMind. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default SignUp;