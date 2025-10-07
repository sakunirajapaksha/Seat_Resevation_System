import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import "./index.css";

// Seat booking related components
import SeatBooking from "./pages/SeatGrid";
import SeatSquare from "./components/SeatSquare";
import InternDashboard from "./pages/InternDashboard";

// Admin components
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAddSeat from "./pages/AdminAddSeat";
import AdminEditSeats from "./pages/AdminEditSeats";  
import AdminReservationsByDate from "./pages/AdminReservationsByDate";
import AdminReservationsByIntern from "./pages/AdminReservationsByIntern";
import AdminManualAssign from "./pages/AdminManualAssign";
import AdminReports from "./pages/AdminReports";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Enhanced Navigation Bar */}
        <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-white p-2 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  SeatReserve Pro
                </h1>
              </div>
              
              <nav className="flex items-center space-x-6">
                <Link 
                  to="/" 
                  className="hover:bg-blue-700 px-3 py-2 rounded-lg transition-all duration-200 font-medium hover:scale-105"
                >
                  Home
                </Link>
                <Link 
                  to="/register" 
                  className="hover:bg-blue-700 px-3 py-2 rounded-lg transition-all duration-200 font-medium hover:scale-105"
                >
                  Register
                </Link>
                <Link 
                  to="/login" 
                  className="hover:bg-blue-700 px-3 py-2 rounded-lg transition-all duration-200 font-medium hover:scale-105"
                >
                  Login
                </Link>
                
              </nav>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-screen">
          <Routes>
            <Route
              path="/"
              element={
                <div className="relative min-h-screen flex items-center justify-center">
                  {/* Background Image with Overlay */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")'
                    }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                  </div>
                  
                  {/* Hero Content */}
                  <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6 py-16">
                    <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white border-opacity-20">
                      <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                        Smart Seat Reservation
                      </h2>
                      <p className="text-xl md:text-2xl mb-8 text-blue-100 font-light">
                        Streamline your workspace with intelligent seat booking
                      </p>
                      
                      <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm">
                          <div className="text-3xl mb-3">🏢</div>
                          <h3 className="font-semibold text-lg mb-2">Flexible Workspaces</h3>
                          <p className="text-blue-100">Book your perfect spot for maximum productivity</p>
                        </div>
                        <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm">
                          <div className="text-3xl mb-3">⚡</div>
                          <h3 className="font-semibold text-lg mb-2">Instant Reservations</h3>
                          <p className="text-blue-100">Quick and easy booking process</p>
                        </div>
                        <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm">
                          <div className="text-3xl mb-3">📊</div>
                          <h3 className="font-semibold text-lg mb-2">Smart Management</h3>
                          <p className="text-blue-100">Advanced tools for administrators</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link 
                          to="/register" 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          Get Started
                        </Link>
                        <Link 
                          to="/login" 
                          className="border-2 border-white text-white hover:bg-white hover:bg-opacity-20 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105"
                        >
                          Sign In
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/seat-booking" element={<SeatBooking />} />
            <Route path="/seat-square/:id" element={<SeatSquare />} />
            <Route path="/intern-dashboard" element={<InternDashboard />} />

            {/* Admin Routes */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-add-seat" element={<AdminAddSeat />} />
            <Route path="/admin-edit-seats" element={<AdminEditSeats />} />
            <Route path="/admin-reservations" element={<AdminReservationsByDate />} />
            <Route path="/admin-reservations-intern" element={<AdminReservationsByIntern />} />
            <Route path="/admin-manual-assign" element={<AdminManualAssign />} />
            <Route path="/admin-reports" element={<AdminReports />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400">
              © 2024 SeatReserve Pro. All rights reserved. | 
              Streamlining workspace management for modern teams
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}