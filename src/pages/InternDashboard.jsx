import React, { useState, useEffect, useCallback } from "react";
import API from "../services/api";

/**
 * Intern Dashboard:
 *  - View available seats for a date
 *  - Book seats
 *  - View/Cancel/Modify reservations
 */
export default function InternDashboard() {
  const token = localStorage.getItem("token");

  const [date, setDate] = useState("");
  const [allSeats, setAllSeats] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [bookingSeat, setBookingSeat] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [editing, setEditing] = useState(null);
  const [newSeatId, setNewSeatId] = useState("");

  /** Fetch my reservations */
  const fetchMyReservations = useCallback(async () => {
    try {
      const { data } = await API.get("/reservations/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyReservations(data);
    } catch (err) {
      console.error("Failed to fetch reservations", err);
    }
  }, [token]);

  /** Fetch seats & booking info for selected date */
  async function fetchSeats() {
    if (!date) return alert("Select a date first");
    try {
      setLoadingSeats(true);
      const { data } = await API.get(`/reservations/all-seats?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllSeats(data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load seats");
    } finally {
      setLoadingSeats(false);
    }
  }

  /** Book a seat */
  async function handleBook(seatId, seatNumber) {
    if (!window.confirm(`Book seat #${seatNumber} for ${date}?`)) return;
    try {
      setBookingSeat(seatId);
      await API.post(
        "/reservations/book",
        { seatId, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchSeats();
      await fetchMyReservations();
      alert("Seat booked successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingSeat(null);
    }
  }

  /** Cancel a reservation */
  async function handleCancel(resId) {
    if (!window.confirm("Cancel this reservation?")) return;
    try {
      setCancelling(resId);
      await API.post(
        `/reservations/cancel/${resId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchSeats();
      await fetchMyReservations();
    } catch (err) {
      alert(err.response?.data?.message || "Cancel failed");
    } finally {
      setCancelling(null);
    }
  }

  /** Start modifying a reservation */
  function startEdit(reservation) {
    setEditing(reservation);
    setNewSeatId(reservation.seat?._id || "");
    setDate(new Date(reservation.date).toISOString().split("T")[0]);
  }

  /** Save modification (cancel old + create new) */
  async function saveEdit() {
    if (!newSeatId) return alert("Select a new seat");
    if (!window.confirm("Confirm modification? This will cancel the old booking.")) return;
    try {
      await API.post(
        `/reservations/cancel/${editing._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await API.post(
        "/reservations/book",
        { seatId: newSeatId, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Reservation updated");
      setEditing(null);
      setNewSeatId("");
      await fetchSeats();
      await fetchMyReservations();
    } catch (err) {
      alert(err.response?.data?.message || "Modification failed");
    }
  }

  useEffect(() => {
    fetchMyReservations();
  }, [fetchMyReservations]);

  /** Check if current user already booked this seat for selected date */
  function isMyBooking(seatId) {
    return myReservations.some(
      (r) =>
        r.status === "active" &&
        new Date(r.date).toISOString().split("T")[0] === date &&
        r.seat?._id === seatId
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Intern Seat Reservation
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Manage your seat bookings, view availability, and modify reservations with ease
          </p>
        </div>

        {/* Date Picker & Load Seats */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 mb-8 border border-white/20">
          <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
            <div className="relative flex-1 max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                Select Date
              </label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 focus:outline-none transition-all duration-300"
              />
            </div>
            <button
              onClick={fetchSeats}
              disabled={!date || loadingSeats}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-6 md:mt-0"
            >
              {loadingSeats ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading Seats...
                </div>
              ) : (
                "View Available Seats"
              )}
            </button>
          </div>
        </div>

        {/* Seat Grid */}
        {allSeats.length > 0 && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 mb-12 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Available Seats for {new Date(date).toLocaleDateString()}
            </h2>
            
            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6">
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

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-4">
              {allSeats.map((seat) => {
                const mine = isMyBooking(seat._id);
                const booked = seat.booked;
                return (
                  <div
                    key={seat._id}
                    className={`p-4 text-center border-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      mine 
                        ? "bg-green-50 border-green-500 shadow-lg" 
                        : booked 
                        ? "bg-red-50 border-red-400" 
                        : "bg-white border-gray-300 hover:border-blue-400 hover:shadow-lg"
                    }`}
                  >
                    <div className="font-bold text-lg text-gray-800">#{seat.seatNumber}</div>
                    <div className="text-xs text-gray-500 mb-3">{seat.location}</div>

                    {!booked && !mine && (
                      <button
                        onClick={() => handleBook(seat._id, seat.seatNumber)}
                        disabled={bookingSeat === seat._id}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all duration-300 disabled:opacity-50"
                      >
                        {bookingSeat === seat._id ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Booking...
                          </div>
                        ) : "Book"}
                      </button>
                    )}
                    {mine && (
                      <div className="bg-green-500 text-white text-sm py-2 rounded-lg font-medium">
                        My Seat
                      </div>
                    )}
                    {booked && !mine && (
                      <div className="bg-red-400 text-white text-sm py-2 rounded-lg font-medium">
                        Booked
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* My Reservations Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            My Reservations
          </h2>

          {myReservations.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-600 text-lg">No reservations found</p>
              <p className="text-gray-500">Select a date above to book your first seat!</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-blue-500 to-indigo-600">
                  <tr>
                    <th className="p-4 text-left text-white font-semibold">Seat Number</th>
                    <th className="p-4 text-left text-white font-semibold">Date</th>
                    <th className="p-4 text-left text-white font-semibold">Location</th>
                    <th className="p-4 text-left text-white font-semibold">Status</th>
                    <th className="p-4 text-left text-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {myReservations.map((r) => (
                    <tr key={r._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="p-4 font-medium text-gray-900">#{r.seat?.seatNumber}</td>
                      <td className="p-4 text-gray-700">{new Date(r.date).toLocaleDateString()}</td>
                      <td className="p-4 text-gray-600">{r.seat?.location || "N/A"}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          r.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : r.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {r.status === "active" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCancel(r._id)}
                              disabled={cancelling === r._id}
                              className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-400/50 transition-all duration-300 disabled:opacity-50 text-sm"
                            >
                              {cancelling === r._id ? (
                                <div className="flex items-center">
                                  <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Cancelling...
                                </div>
                              ) : "Cancel"}
                            </button>
                            <button
                              onClick={() => startEdit(r)}
                              className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:from-yellow-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all duration-300 text-sm"
                            >
                              Modify
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modify Reservation Modal */}
        {editing && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modify Reservation
                </h3>
                <p className="text-gray-600 mt-2">
                  Changing seat for <strong>{new Date(editing.date).toLocaleDateString()}</strong>
                </p>
              </div>
              
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select New Seat
                </label>
                <select
                  value={newSeatId}
                  onChange={(e) => setNewSeatId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 focus:outline-none transition-all duration-300"
                >
                  <option value="">-- Select New Seat --</option>
                  {allSeats
                    .filter((s) => !s.booked)
                    .map((s) => (
                      <option key={s._id} value={s._id}>
                        Seat #{s.seatNumber} - {s.location}
                      </option>
                    ))}
                </select>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setEditing(null)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400/50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}