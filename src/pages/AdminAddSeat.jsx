// frontend/src/pages/AdminAddSeat.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function AdminAddSeat() {
  const [date, setDate] = useState("");
  const [startNumber, setStartNumber] = useState(1);
  const [count, setCount] = useState(25);
  const [location, setLocation] = useState("");
  const [amenities, setAmenities] = useState("");
  const [loading, setLoading] = useState(false);
  const [seats, setSeats] = useState([]);
  const [fetchingSeats, setFetchingSeats] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const fetchSeats = useCallback(async () => {
    if (!token || !date) return;
    setFetchingSeats(true);
    try {
      const { data } = await API.get(`/seats?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSeats(data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load seat list");
    } finally {
      setFetchingSeats(false);
    }
  }, [token, date]);

  useEffect(() => { 
    if (date) {
      fetchSeats(); 
    }
  }, [fetchSeats, date]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!date) return alert("Please select a date");
    if (count < 1) return alert("Seat count must be at least 1");

    setLoading(true);
    try {
      for (let i = 0; i < count; i++) {
        const seatNum = startNumber + i;
        await API.post(
          "/seats",
          {
            seatNumber: seatNum,
            date,
            location,
            amenities: amenities
              ? amenities.split(",").map((a) => a.trim())
              : [],
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      alert(`${count} seats added for ${date}`);
      setStartNumber(startNumber + count);
      setLocation("");
      setAmenities("");
      fetchSeats();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add seats");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Add Seats for a Day</h1>
              <p className="text-gray-600 mt-1">Manage seating arrangements for specific dates</p>
            </div>
            <button
              onClick={() => navigate("/admin-dashboard")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>

          {/* Add Multiple Seats Form */}
          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Seats</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Date *</label>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Start Number</label>
                <input
                  type="number"
                  value={startNumber}
                  onChange={(e) => setStartNumber(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Seat Count *</label>
                <input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  min="1"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  placeholder="e.g., Main Hall, Zone A"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Amenities</label>
                <input
                  type="text"
                  placeholder="WiFi, Power, Monitor"
                  value={amenities}
                  onChange={(e) => setAmenities(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-gray-500">Separate with commas</p>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading || !date}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Adding Seats...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add {count} Seats
                </>
              )}
            </button>
          </form>
        </div>

        {/* Existing Seats for Selected Date */}
        {date && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Seats on {date}</h2>
                <p className="text-gray-600 mt-1">{seats.length} seat{seats.length !== 1 ? 's' : ''} available</p>
              </div>
              {fetchingSeats && (
                <div className="flex items-center gap-2 text-blue-600">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-sm">Updating...</span>
                </div>
              )}
            </div>

            {seats.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-lg">No seats created for this date yet</p>
                <p className="text-sm">Use the form above to add seats</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {seats.map((s) => (
                  <div key={s._id} className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 text-center transition-all duration-200 hover:shadow-md hover:scale-105">
                    <div className="font-bold text-lg text-blue-800">Seat {s.seatNumber}</div>
                    {s.location && (
                      <p className="text-xs text-blue-600 font-medium mt-1 bg-blue-200 px-2 py-1 rounded-full inline-block">
                        {s.location}
                      </p>
                    )}
                    {s.amenities && s.amenities.length > 0 && (
                      <p className="text-[10px] text-gray-600 mt-2 line-clamp-1">
                        {s.amenities.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}