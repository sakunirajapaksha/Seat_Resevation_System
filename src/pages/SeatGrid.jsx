import React, { useState, useEffect, useCallback } from "react";
import API from "../services/api";
import SeatSquare from "../components/SeatSquare";

export default function SeatGrid() {
  const [date, setDate] = useState("");
  const [seats, setSeats] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [booking, setBooking] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchSeats = useCallback(async () => {
    if (!date) return;
    setLoading(true);
    try {
      const { data } = await API.get(`/reservations/all-seats?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSeats(data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load seats");
    } finally {
      setLoading(false);
    }
  }, [date, token]);

  const fetchMyReservations = useCallback(async () => {
    try {
      const { data } = await API.get("/reservations/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyReservations(data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    if (date) fetchSeats();
  }, [date, fetchSeats]);

  useEffect(() => {
    fetchMyReservations();
  }, [fetchMyReservations]);

  async function handleBook(seatId, seatNumber) {
    if (!date) return alert("Select a date first");
    if (!window.confirm(`Book seat ${seatNumber} for ${date}?`)) return;
    setBooking(seatId);
    try {
      await API.post(
        "/reservations/book",
        { seatId, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSeats();
      fetchMyReservations();
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setBooking(null);
    }
  }

  async function handleCancel(resId) {
    if (!window.confirm("Cancel this reservation?")) return;
    setCancelling(resId);
    try {
      await API.post(
        `/reservations/cancel/${resId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSeats();
      fetchMyReservations();
    } catch (err) {
      alert(err.response?.data?.message || "Cancel failed");
    } finally {
      setCancelling(null);
    }
  }

  function myReservationFor(seatId) {
    return myReservations.find(
      (r) =>
        r.seat?._id === seatId &&
        new Date(r.date).toISOString().split("T")[0] === date &&
        r.status === "active"
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Seat Reservation System
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Book your preferred seat for any date. Green indicates your reservation, red shows booked seats, and white seats are available.
          </p>
        </div>

        {/* Date Picker Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 mb-8 border border-white/20">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-3 ml-1">
                Select Booking Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 focus:outline-none transition-all duration-300"
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              {/* Legend */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">My Seat</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-100 border-2 border-red-400 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Booked</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-xl text-gray-600">Loading available seats...</span>
            </div>
          </div>
        )}

        {/* Seat Grid */}
        {date && !loading && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Available Seats for {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h2>
              <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                {seats.filter(seat => !seat.booked).length} seats available
              </div>
            </div>

            <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-4 justify-center">
              {seats.map((seat) => {
                const myRes = myReservationFor(seat._id);
                return (
                  <SeatSquare
                    key={seat._id}
                    seat={seat}
                    isMine={!!myRes}
                    isBooked={seat.booked}
                    myReservation={myRes}
                    booking={booking}
                    cancelling={cancelling}
                    onBook={handleBook}
                    onCancel={handleCancel}
                  />
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {seats.filter(seat => {
                    const myRes = myReservationFor(seat._id);
                    return !!myRes;
                  }).length}
                </div>
                <div className="text-sm text-green-700">Your Reservations</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {seats.filter(seat => !seat.booked).length}
                </div>
                <div className="text-sm text-blue-700">Available Seats</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {seats.filter(seat => seat.booked).length}
                </div>
                <div className="text-sm text-red-700">Booked Seats</div>
              </div>
            </div>
          </div>
        )}

        {/* No Date Selected State */}
        {!date && !loading && (
          <div className="text-center py-16 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20">
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Date</h3>
              <p className="text-gray-600 mb-6">
                Choose a date from the calendar above to view available seats and make reservations.
              </p>
              <div className="text-sm text-gray-500">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                You can only book seats for future dates
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}