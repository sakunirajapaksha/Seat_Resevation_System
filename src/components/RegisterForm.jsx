import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function RegisterForm() {
  const initialState = {
    firstName: "",
    lastName: "",
    address: "",
    dob: "",
    nic: "",
    email: "",
    phone: "",
    techStack: "",
    university: "",
    password: ""
  };

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  }

  function validateForm() {
    const newErrors = {};
    
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (!form.techStack) newErrors.techStack = "Tech stack is required";
    if (!form.university) newErrors.university = "University is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleClear() {
    setForm(initialState);
    setErrors({});
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await API.post("/auth/register", form);
      const { token } = res.data;
      localStorage.setItem("token", token);
      window.location.href = "/booking";
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Registration failed";
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-8 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2000ms' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: '4000ms' }}></div>
      </div>

      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-500 hover:shadow-3xl">
        <div className="md:flex min-h-[600px]">
          {/* Left Side - Enhanced */}
          <div className="hidden md:block md:w-2/5 bg-gradient-to-br from-blue-600/90 to-indigo-700/90 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-2 text-white">
                  Join Our Community
                </h2>
                <p className="text-blue-100 text-lg">
                  Create your account and start your journey with us
                </p>
              </div>
              
              <div className="space-y-6">
                {[
                  { number: "01", text: "Quick and secure registration" },
                  { number: "02", text: "Access to exclusive features" },
                  { number: "03", text: "Manage your bookings easily" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mr-4 border border-white/20">
                      <span className="text-lg font-bold text-white">{item.number}</span>
                    </div>
                    <span className="text-white font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <div className="inline-flex items-center text-blue-200 text-sm">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Your data is securely protected
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Enhanced */}
          <div className="md:w-3/5 p-8 md:p-10">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                Create Your Account
              </h1>
              <p className="text-gray-200 text-lg">Fill in your details to get started</p>
            </div>

            {errors.submit && (
              <div className="mb-6 p-4 bg-red-400/10 border border-red-400/20 rounded-2xl text-red-200 text-sm backdrop-blur-sm">
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {errors.submit}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="firstName" className="block text-sm font-medium text-white mb-2 ml-1">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-gray-300 ${
                      errors.firstName 
                        ? "border-red-400 focus:ring-2 focus:ring-red-400/50" 
                        : "border-gray-400/50 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-300 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="group">
                  <label htmlFor="lastName" className="block text-sm font-medium text-white mb-2 ml-1">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-gray-300 ${
                      errors.lastName 
                        ? "border-red-400 focus:ring-2 focus:ring-red-400/50" 
                        : "border-gray-400/50 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-300 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2 ml-1">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 bg-white/10 border rounded-xl focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-gray-300 ${
                    errors.email 
                      ? "border-red-400 focus:ring-2 focus:ring-red-400/50" 
                      : "border-gray-400/50 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
                  }`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-300 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2 ml-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a strong password (min 8 characters)"
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-gray-300 pr-12 ${
                      errors.password 
                        ? "border-red-400 focus:ring-2 focus:ring-red-400/50" 
                        : "border-gray-400/50 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3.5 text-gray-300 hover:text-white transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-300 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="phone" className="block text-sm font-medium text-white mb-2 ml-1">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    className="w-full px-4 py-3 bg-white/10 border border-gray-400/50 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-gray-300"
                  />
                </div>

                <div className="group">
                  <label htmlFor="dob" className="block text-sm font-medium text-white mb-2 ml-1">
                    Date of Birth
                  </label>
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    value={form.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-400/50 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white"
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="address" className="block text-sm font-medium text-white mb-2 ml-1">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Your complete address"
                  className="w-full px-4 py-3 bg-white/10 border border-gray-400/50 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-gray-300"
                />
              </div>

              <div className="group">
                <label htmlFor="nic" className="block text-sm font-medium text-white mb-2 ml-1">
                  NIC Number
                </label>
                <input
                  id="nic"
                  name="nic"
                  value={form.nic}
                  onChange={handleChange}
                  placeholder="Your NIC number"
                  className="w-full px-4 py-3 bg-white/10 border border-gray-400/50 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-gray-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="techStack" className="block text-sm font-medium text-white mb-2 ml-1">
                    Tech Stack *
                  </label>
                  <select
                    id="techStack"
                    name="techStack"
                    value={form.techStack}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl focus:outline-none transition-all duration-300 backdrop-blur-sm text-white ${
                      errors.techStack 
                        ? "border-red-400 focus:ring-2 focus:ring-red-400/50" 
                        : "border-gray-400/50 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
                    }`}
                  >
                    <option value="" className="text-gray-700">Select your tech stack</option>
                    <option value="MERN" className="text-gray-700">MERN Stack</option>
                    <option value=".NET" className="text-gray-700">.NET Framework</option>
                    <option value="Python" className="text-gray-700">Python</option>
                    <option value="Laravel" className="text-gray-700">Laravel</option>
                    <option value="Java" className="text-gray-700">Java</option>
                    <option value="React" className="text-gray-700">React</option>
                    <option value="Vue" className="text-gray-700">Vue.js</option>
                    <option value="Angular" className="text-gray-700">Angular</option>
                  </select>
                  {errors.techStack && (
                    <p className="mt-2 text-sm text-red-300 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      {errors.techStack}
                    </p>
                  )}
                </div>

                <div className="group">
                  <label htmlFor="university" className="block text-sm font-medium text-white mb-2 ml-1">
                    University *
                  </label>
                  <select
                    id="university"
                    name="university"
                    value={form.university}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl focus:outline-none transition-all duration-300 backdrop-blur-sm text-white ${
                      errors.university 
                        ? "border-red-400 focus:ring-2 focus:ring-red-400/50" 
                        : "border-gray-400/50 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
                    }`}
                  >
                    <option value="" className="text-gray-700">Select your university</option>
                    <option value="University of Colombo" className="text-gray-700">Sliate</option>
                    <option value="University of Peradeniya" className="text-gray-700">University of Peradeniya</option>
                    <option value="University of Moratuwa" className="text-gray-700">University of Moratuwa</option>
                    <option value="University of Ruhuna" className="text-gray-700">University of Ruhuna</option>
                    <option value="University of Kelaniya" className="text-gray-700">University of Kelaniya</option>
                    <option value="Other" className="text-gray-700">University of Colombo</option>
                  </select>
                  {errors.university && (
                    <p className="mt-2 text-sm text-red-300 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      {errors.university}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  <div className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Create Account
                      </>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </button>
                
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex-1 bg-white/20 backdrop-blur-sm text-white py-4 rounded-xl font-semibold hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:ring-offset-2 transition-all duration-300 border border-white/30 hover:shadow-lg"
                >
                  Clear Form
                </button>
              </div>
            </form>

            <p className="text-center text-sm text-gray-200 mt-8">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-blue-300 hover:text-blue-200 transition-colors duration-200 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        .animate-pulse { animation: pulse 6s infinite; }
        .hover-shadow-3xl:hover { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
        
        /* Style for select dropdown options */
        select option {
          background: white;
          color: #374151;
        }
      `}</style>
    </div>
  );
}