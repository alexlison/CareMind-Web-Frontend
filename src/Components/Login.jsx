import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { BrainCircuit, Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

 

  const [input, setInput] = useState({
    email: "",
    password: ""
  });

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!input.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(input.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!input.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const inputHandler = (event) => {
    setInput({
      ...input,
      [event.target.name]: event.target.value
    });

    if (errors[event.target.name]) {
      setErrors({
        ...errors,
        [event.target.name]: ""
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: input.email,
        password: input.password
      });

      const data = response.data;

      if (data.Status === "Success") {
        console.log("token --> ",data.token);
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("userId", data.user._id);
        sessionStorage.setItem("userType", data.user.role);
        sessionStorage.setItem("userName", data.user.name);

        setMessage("Login successful! Redirecting...");

        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (data.user.role === "caregiver") {
          navigate("/caregiverHome");
        } else {
          navigate("/dashboard");
        }
      }

    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setMessage("Invalid email or password");
        } else {
          setMessage(error.response.data.message || "Login failed");
        }
      } else {
        setMessage("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E8F5E9] shadow mb-4">
            <BrainCircuit className="w-8 h-8 text-[#2E7D32]" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Care<span className="font-light ps-1">Mind</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, please login
          </p>
        </div>

        <div className="bg-white w-full rounded-2xl shadow-2xl border border-gray-200 px-10 py-10">

            <h2 className="text-2xl font-bold text-gray-700 mb-5"> Sign In</h2>
            {message && (
            <div className={`mb-4 p-3 rounded-lg text-center text-sm font-medium ${
              message.includes("successful")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-left text-xs font-semibold text-gray-600 mb-1 tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={inputHandler}
                  placeholder="Enter your email"
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border ${
                    errors.email ? " border-red-400" : "border-gray-300"
                  } rounded-xl text-sm outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/30`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-left px-3 font-semibold text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-left text-xs font-semibold text-gray-600 mb-1 tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={input.password}
                  onChange={inputHandler}
                  placeholder="Enter your password"
                  disabled={loading}
                  className={`w-full pl-10 pr-12 py-3.5 bg-gray-50 border ${
                    errors.password ? "border-red-400" : "border-gray-300"
                  } rounded-xl text-sm outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/30`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-left px-3 font-semibold text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Forgot */}
            {/* <div className="text-right">
              <Link to="/forgot-password" className="text-xs text-[#2E7D32] hover:underline">
                Forgot password?
              </Link>
            </div> */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#2d9134] to-[#359a3a] hover:from-[#1B5E20] hover:to-[#2E7D32]
              text-white font-semibold py-3.5 rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight size={16} />
                </span>
              )}
            </button>

          </form>

          <div className="mt-6 pt-5 border-t text-center">
            <p className="text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link to="/register" className="text-[#2E7D32] font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>

        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2025 CareMind. All rights reserved.
        </p>

      </div>
    </div>
  );
};

export default Login;
