import React, { useState } from "react";
import API from "../services/api";

export default function AdminReservationsByIntern() {
  const [email, setEmail] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("adminToken");

  async function fetchData() {
    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const { data } = await API.get(`/reservations/by-intern?email=${encodeURIComponent(email)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load reservations");
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchData();
    }
  };

  const clearSearch = () => {
    setEmail("");
    setResults(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Reservations By Intern</h1>
            <p className="text-gray-600">Search for all reservations made by a specific intern</p>
          </div>

          {/* Search Section */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Intern Email Address</label>
                <div className="relative">
                  <input 
                    type="email"
                    placeholder="Enter intern email address..."
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <div className="absolute right-3 top-3 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={clearSearch}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </button>
                
                <button 
                  onClick={fetchData}
                  disabled={loading || !email.trim()}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Searching...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Intern Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {results.intern.firstName} {results.intern.lastName}
                    </h2>
                    <p className="text-blue-100">{results.intern.email}</p>
                  </div>
                </div>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {results.reservations.length} reservation{results.reservations.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Reservations Table */}
            {results.reservations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left p-4 font-semibold text-gray-700">Seat Number</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Location</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {results.reservations.map((r) => (
                      <tr key={r._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="font-bold text-blue-700">#{r.seat?.seatNumber}</span>
                            </div>
                            <span className="font-medium text-gray-900">Seat {r.seat?.seatNumber}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-gray-900">
                            {new Date(r.date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-gray-600 text-sm">
                            {r.seat?.location || 'Not specified'}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            r.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800'
                              : r.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Reservations Found</h3>
                <p className="text-gray-600">This intern hasn't made any reservations yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!results && !loading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Search for Intern Reservations</h3>
              <p className="text-gray-600">Enter an intern's email address to view their reservation history.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}