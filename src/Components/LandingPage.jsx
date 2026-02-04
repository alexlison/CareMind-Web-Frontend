import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, Heart, LogIn as LoginIcon, Rocket, Clock,
  Users, Mic, MapPin, Bell, Shield, User,
  UserPlus, ChevronRight, Menu, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { 
      icon: <Clock className="w-6 h-6" />, 
      title: "Smart Reminders", 
      desc: "Adaptive medication and routine scheduling with priority-based alerts", 
      color: "bg-[#249f2c]" 
    },
    { 
      icon: <Users className="w-6 h-6" />, 
      title: "Face Recognition", 
      desc: "Helps patients identify familiar people instantly with AI-powered recognition", 
      color: "bg-[#2d9134]" 
    },
    { 
      icon: <BrainCircuit className="w-6 h-6" />, 
      title: "Memory Reinforcement", 
      desc: "Adaptive AI analyzes patterns and reinforces frequently forgotten information", 
      color: "bg-[#3a8d3e]" 
    },
    { 
      icon: <Mic className="w-6 h-6" />, 
      title: "Voice Assistant", 
      desc: "Natural conversation support for queries and daily activity guidance", 
      color: "bg-[#359a3a]" 
    },
    { 
      icon: <MapPin className="w-6 h-6" />, 
      title: "Safety Tracking", 
      desc: "Emergency location sharing with privacy-focused GPS monitoring", 
      color: "bg-[#2d9134]" 
    },
    { 
      icon: <Bell className="w-6 h-6" />, 
      title: "Smart Alerts", 
      desc: "Real-time caregiver notifications for missed routines and emergencies", 
      color: "bg-[#249f2c]" 
    },
  ];

  const roles = [
    { 
      icon: <Shield className="w-8 h-8 lg:w-10 lg:h-10" />, 
      title: "Admin", 
      desc: "Manage caregivers, monitor system usage, and control configurations", 
      color: "bg-[#249f2c]" 
    },
    { 
      icon: <Users className="w-8 h-8 lg:w-10 lg:h-10" />, 
      title: "Caregiver", 
      desc: "Register patients, configure routines, track compliance, and monitor safety", 
      color: "bg-[#2d9134]" 
    },
    { 
      icon: <User className="w-8 h-8 lg:w-10 lg:h-10" />, 
      title: "Patient", 
      desc: "Receive reminders, use voice assistant, recognize people, and get emergency help", 
      color: "bg-[#3a8d3e]" 
    },
  ];

  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-gradient-to-r from-[#249f2c] to-[#3a8d3e] shadow-xl' 
            : 'bg-gradient-to-r from-[#2d9134] to-[#359a3a] shadow-lg'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-lg bg-slate-200 flex items-center justify-center shadow-md hover:shadow-lg transition-all">
                <BrainCircuit className="w-7 h-7 text-[#2d9134]" strokeWidth={2} />
              </div>
              <div className="flex items-baseline">
                <span className="text-xl font-bold text-white tracking-tight">Care</span>
                <span className="text-xl font-light  text-white/95 tracking-tight">Mind</span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#home" className="text-white/90 hover:text-white font-medium transition-colors">Home</a>
              <a href="#features" className="text-white/90 hover:text-white font-medium transition-colors">Features</a>
              <a href="#roles" className="text-white/90 hover:text-white font-medium transition-colors">Roles</a>
              <a href="#about" className="text-white/90 hover:text-white font-medium transition-colors">About</a>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <button 
                onClick={() => navigate('/login')}
                className="flex items-center space-x-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg border border-white/25 transition-all duration-200 group"
              >
                <LoginIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-white">Login</span>
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="flex items-center space-x-2 px-5 py-2.5 bg-white text-[#2d9134] hover:bg-gray-50 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <UserPlus className="w-4 h-4" />
                <span className="text-sm">Sign Up</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden pb-6 pt-2 space-y-3">
              <a href="#home" className="block px-4 py-2.5 text-white/90 hover:bg-white/10 rounded-lg transition-all">Home</a>
              <a href="#features" className="block px-4 py-2.5 text-white/90 hover:bg-white/10 rounded-lg transition-all">Features</a>
              <a href="#roles" className="block px-4 py-2.5 text-white/90 hover:bg-white/10 rounded-lg transition-all">Roles</a>
              <a href="#about" className="block px-4 py-2.5 text-white/90 hover:bg-white/10 rounded-lg transition-all">About</a>
              <div className="flex flex-col gap-2 pt-3 border-t border-white/20">
                <button 
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg border border-white/25 transition-all duration-200"
                >
                  <LoginIcon className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white">Login</span>
                </button>
                <button 
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white text-[#2d9134] hover:bg-gray-50 rounded-lg font-semibold transition-all duration-200"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="text-sm">Sign Up</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="h-20"></div>

      {/* Hero Section */}
      <section id="home" className="py-10 lg:py-10 px-6 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-4xl lg:text-4xl xl:text-4xl font-bold bg-gradient-to-r from-[#249f2c] via-[#2d9134] to-[#3a8d3e] bg-clip-text text-transparent mb-6 leading-tight tracking-tight">
                Adaptive Cognitive Care
              </h1>
              
              <p className="text-gray-700 text-lg lg:text-xl xl:text-2xl mb-8 lg:mb-10 leading-relaxed font-medium">
                AI-powered memory reinforcement system designed to support dementia patients through intelligent reminders and personalized care
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => navigate('/register')}
                  className="group px-8 py-4 bg-gradient-to-r from-[#249f2c] via-[#2d9134] to-[#3a8d3e] text-white rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  <span>Get Started</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 border-2 border-[#2d9134] text-[#2d9134] rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 hover:bg-[#f0fff4] transition-all duration-300 hover:scale-105"
                >
                  <LoginIcon className="w-6 h-6" />
                  <span>Login</span>
                </button>
              </div>
            </div>

            {/* Right Content - Logo */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative inline-block">
                <div className="absolute inset-0 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-[#f0fff4] to-[#e6fffa] blur-3xl animate-pulse"></div>
                <div className="relative w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-[#249f2c] via-[#2d9134] to-[#3a8d3e] flex items-center justify-center shadow-2xl hover:scale-105 transition-transform duration-500 border-4 border-white/20">
                  <BrainCircuit className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 text-white" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28 bg-gradient-to-br from-[#f0fff4] via-white to-[#e6fffa] w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-[#249f2c] via-[#2d9134] to-[#3a8d3e] bg-clip-text text-transparent mb-4 tracking-tight">
              Comprehensive Care Features
            </h2>
            <p className="text-gray-700 text-xl lg:text-2xl font-medium">
              Everything you need for adaptive dementia care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-8 lg:p-10 rounded-3xl border-2 border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 group cursor-pointer relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#f0fff4]/0 to-[#e6fffa]/0 group-hover:from-[#f0fff4]/50 group-hover:to-[#e6fffa]/50 transition-all duration-300 rounded-3xl"></div>
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className={`w-20 h-20 lg:w-24 lg:h-24 ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    {React.cloneElement(feature.icon, { className: "w-10 h-10 lg:w-12 lg:h-12 text-white", strokeWidth: 2 })}
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-gray-600 text-base lg:text-lg leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-20 lg:py-28 px-6 w-full bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-[#249f2c] via-[#2d9134] to-[#3a8d3e] bg-clip-text text-transparent mb-4 tracking-tight">
              Built for Everyone
            </h2>
            <p className="text-gray-700 text-xl lg:text-2xl font-medium">
              Role-based access for seamless care coordination
            </p>
          </div>

          <div className="space-y-6 lg:space-y-8">
            {roles.map((role, index) => (
              <div 
                key={index}
                className="bg-gradient-to-r from-[#f0fff4] via-white to-[#e6fffa] p-10 lg:p-12 rounded-3xl border-2 border-[#e6fffa] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
              >
                <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8">
                  <div className={`${role.color} w-28 h-28 lg:w-32 lg:h-32 rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex-shrink-0`}>
                    <div className="text-white">
                      {role.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 tracking-tight">{role.title}</h3>
                    <p className="text-gray-700 text-lg lg:text-xl leading-relaxed font-medium">{role.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="about" className="py-20 lg:py-28 px-6 w-full bg-gradient-to-br from-[#f0fff4] via-white to-[#e6fffa]">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#249f2c] via-[#2d9134] to-[#3a8d3e] rounded-3xl p-12 lg:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="text-center relative z-10">
              <div className="w-24 h-24 lg:w-28 lg:h-28 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 group hover:scale-110 transition-all duration-300 shadow-xl">
                <Rocket className="w-12 h-12 lg:w-14 lg:h-14 text-white group-hover:rotate-12 transition-transform" strokeWidth={2} />
              </div>
              
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6 tracking-tight">
                Start Making a Difference Today
              </h2>
              
              <p className="text-white/95 text-xl lg:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
                Join caregivers who are transforming dementia care with AI
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
                <button 
                  onClick={() => navigate('/register')}
                  className="px-10 py-5 bg-white text-[#2d9134] rounded-xl font-bold text-lg flex items-center justify-center space-x-3 shadow-2xl hover:shadow-3xl hover:bg-gray-50 transition-all duration-300 hover:scale-105 group"
                >
                  <UserPlus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>Create Account</span>
                </button>
                
                <button 
                  onClick={() => navigate('/login')}
                  className="px-10 py-5 text-white border-2 border-white/40 backdrop-blur-sm rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  <LoginIcon className="w-5 h-5" />
                  <span>Already have an account? Login</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 lg:py-16 bg-gradient-to-b from-gray-50 to-gray-100 w-full border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-gradient-to-br from-[#249f2c] via-[#2d9134] to-[#3a8d3e] flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300">
                <BrainCircuit className="w-8 h-8 lg:w-10 lg:h-10 text-white" strokeWidth={2} />
              </div>
              <span className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#249f2c] via-[#2d9134] to-[#3a8d3e] bg-clip-text text-transparent tracking-tight">
                CareMind
              </span>
            </div>
            
            <p className="text-gray-700 text-lg lg:text-xl mb-8 tracking-wide font-medium">
              Where Care Meets Intelligence 🧩
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 mb-8 text-gray-700 font-medium">
              <a href="#home" className="hover:text-[#2d9134] transition-colors">Home</a>
              <a href="#features" className="hover:text-[#2d9134] transition-colors">Features</a>
              <a href="#roles" className="hover:text-[#2d9134] transition-colors">Roles</a>
              <a href="#about" className="hover:text-[#2d9134] transition-colors">About</a>
              <a href="/privacy" className="hover:text-[#2d9134] transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-[#2d9134] transition-colors">Terms of Service</a>
            </div>
            
            <p className="text-gray-600 text-sm font-medium">
              © 2025 CareMind. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;