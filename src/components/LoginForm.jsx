import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFocused, setIsFocused] = useState({ email: false, password: false });

  /* ---------------------- Validation ---------------------- */
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Email is invalid";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password]);

  /* ---------------------- Redirect helper ---------------------- */
  const handleRedirect = useCallback(
    (user) => {
      localStorage.setItem("token", user.token);
      localStorage.setItem("role", user.role);

      if (user.role === "admin") navigate("/admin-dashboard");
      else navigate("/intern-dashboard");
    },
    [navigate]
  );

  /* ---------------------- Google Login ---------------------- */
  const handleGoogle = useCallback(
    async (response) => {
      try {
        const res = await API.post("/auth/google", {
          token: response.credential,
        });
        handleRedirect({
          token: res.data.token,
          role: res.data.user.role,
        });
      } catch (err) {
        alert(err.response?.data?.message || "Google login failed");
      }
    },
    [handleRedirect]
  );

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogle,
      });
      google.accounts.id.renderButton(document.getElementById("googleBtn"), {
        theme: "outline",
        size: "large",
        width: "100%",
        shape: "pill",
      });
    }
  }, [handleGoogle]);

  /* ---------------------- Facebook Login ---------------------- */
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.REACT_APP_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v18.0",
      });
    };

    // Load Facebook SDK
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, []);

  const handleFacebookLogin = useCallback(() => {
    if (!window.FB) {
      alert("Facebook SDK not loaded yet. Please try again.");
      return;
    }

    window.FB.login(
      async (response) => {
        if (response.authResponse) {
          const { accessToken, userID } = response.authResponse;
          try {
            const res = await API.post("/auth/facebook", { accessToken, userID });
            handleRedirect({
              token: res.data.token,
              role: res.data.user.role,
            });
          } catch (err) {
            alert(err.response?.data?.message || "Facebook login failed");
          }
        } else {
          alert("Facebook login cancelled");
        }
      },
      { scope: "email" }
    );
  }, [handleRedirect]);

  /* ---------------------- Email / Password Login ---------------------- */
  const submit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      setLoading(true);
      try {
        const res = await API.post("/auth/login", { email, password });
        handleRedirect({
          token: res.data.token,
          role: res.data.user.role,
        });
      } catch (err) {
        setErrors({ submit: err.response?.data?.message || "Login failed" });
      } finally {
        setLoading(false);
      }
    },
    [validateForm, handleRedirect, email, password]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-8 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2000ms' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: '4000ms' }}></div>
      </div>

      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]">
        {/* Decorative Header */}
        <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 p-6 text-center border-b border-white/10">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-blue-100/80 font-light">Sign in to access your workspace</p>
        </div>

        <div className="p-8">
          <form onSubmit={submit} className="space-y-6">
            {/* Email Field */}
            <div className="group">
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    onFocus={() => setIsFocused({ ...isFocused, email: true })}
                    onBlur={() => setIsFocused({ ...isFocused, email: false })}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm"
                    required
                  />
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 -z-10 transition-opacity duration-300 ${isFocused.email ? 'opacity-100' : 'opacity-0'}`}></div>
                </div>
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-300 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="group">
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2 ml-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: "" });
                    }}
                    onFocus={() => setIsFocused({ ...isFocused, password: true })}
                    onBlur={() => setIsFocused({ ...isFocused, password: false })}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm"
                    required
                  />
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 -z-10 transition-opacity duration-300 ${isFocused.password ? 'opacity-100' : 'opacity-0'}`}></div>
                </div>
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                  />
                  <div className="w-5 h-5 bg-white/10 border border-white/30 rounded transition-all duration-200 hover:bg-white/20">
                    <svg className="w-5 h-5 text-blue-400 opacity-0 transition-opacity duration-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <span className="text-white/80 text-sm">Remember me</span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors duration-200 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-3">
                <p className="text-red-300 text-sm text-center flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {errors.submit}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign in to your account
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>
          </form>

          {/* Social Login Section */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-transparent text-white/60 backdrop-blur-sm">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {/* Google Login */}
              <div 
                id="googleBtn" 
                className="google-button-wrapper rounded-xl overflow-hidden hover:transform hover:scale-105 transition-transform duration-200"
              ></div>

              {/* Facebook Login */}
              <button
                onClick={handleFacebookLogin}
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-white/20 rounded-xl font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 backdrop-blur-sm hover:shadow-lg"
              >
                <svg className="w-5 h-5 mr-2 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center text-sm">
            <span className="text-white/60">Don't have an account? </span>
            <Link 
              to="/register" 
              className="font-semibold text-blue-300 hover:text-blue-200 transition-colors duration-200 hover:underline"
            >
              Create account
            </Link>
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
      `}</style>
    </div>
  );
}