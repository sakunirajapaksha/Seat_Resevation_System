import React, { useState } from "react";
import API from "../services/api";

export default function AdminReports() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("adminToken");

  async function generateReport() {
    if (!start || !end) {
      setError("Please select both start and end dates");
      return;
    }
    if (new Date(start) > new Date(end)) {
      setError("Start date cannot be after end date");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { data } = await API.get(
        `/reservations/usage-report?start=${start}&end=${end}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReport(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  }

  const clearReport = () => {
    setReport(null);
    setStart("");
    setEnd("");
    setError("");
  };

  const exportToCSV = () => {
    if (!report) return;
    
    const headers = ["Date", "Total Seats", "Reservations", "Usage Rate"];
    const csvData = report.dailyUsage.map(day => [
      day.date,
      day.totalSeats,
      day.reservations,
      `${day.usageRate}%`
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seat-usage-report-${start}-to-${end}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Seat Usage Analytics</h1>
            <p className="text-gray-600">Generate detailed reports on seat utilization and reservation patterns</p>
          </div>

          {/* Date Range Selection */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Date Range</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Start Date *</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={start} 
                    onChange={e => setStart(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <div className="absolute right-3 top-3 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">End Date *</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={end} 
                    onChange={e => setEnd(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <div className="absolute right-3 top-3 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={clearReport}
                  disabled={loading}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 flex items-center gap-2 flex-1 justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </button>
                
                <button 
                  onClick={generateReport}
                  disabled={loading || !start || !end}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 flex-1 justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Generate
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

        {/* Report Results */}
        {report && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Report Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Seat Usage Report
                  </h2>
                  <p className="text-gray-300">
                    {start} to {end} • {report.dailyUsage.length} days analyzed
                  </p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={exportToCSV}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export CSV
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 border-b border-gray-200">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Usage Rate</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{report.averageUsageRate}%</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Reservations</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{report.totalReservations}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Peak Usage Day</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{report.peakUsageDay?.date || 'N/A'}</p>
                    <p className="text-sm text-gray-600">{report.peakUsageDay?.usageRate || 0}% usage</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Usage Table */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Total Seats</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Reservations</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Usage Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {report.dailyUsage.map((day, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="p-4 font-medium text-gray-900">{day.date}</td>
                        <td className="p-4 text-gray-600">{day.totalSeats}</td>
                        <td className="p-4 text-gray-600">{day.reservations}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-900">{day.usageRate}%</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(day.usageRate, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Initial State */}
        {!report && !loading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Generate Usage Report</h3>
              <p className="text-gray-600">Select a date range to analyze seat utilization patterns and generate detailed analytics.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}