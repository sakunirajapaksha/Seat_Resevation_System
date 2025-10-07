import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function AdminManualAssign() {
  const navigate = useNavigate();
  const [interns, setInterns] = useState([]);
  const [seats, setSeats] = useState([]);
  const [internId, setInternId] = useState("");
  const [seatId, setSeatId] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("adminToken");

  // Load all interns and seats for selection
  useEffect(() => {
    async function loadData() {
      try {
        const [uRes, sRes] = await Promise.all([
          API.get("/users", { headers: { Authorization: `Bearer ${token}` } }),
          API.get("/seats", { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setInterns(uRes.data);
        setSeats(sRes.data);
      } catch (err) {
        alert("Failed to load data");
      }
    }
    loadData();
  }, [token]);

  async function assignSeat() {
    if (!internId || !seatId || !date)
      return alert("Please select intern, seat and date");

    try {
      setLoading(true);
      const res = await API.post(
        "/reservations/manual-assign",
        { internId, seatId, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign seat");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manual Seat Assignment</h1>
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Intern Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Intern
          </label>
          <select
            value={internId}
            onChange={(e) => setInternId(e.target.value)}
            className="w-full border p-3 rounded"
          >
            <option value="">-- Choose Intern --</option>
            {interns.map((u) => (
              <option key={u._id} value={u._id}>
                {u.firstName} {u.lastName} ({u.email})
              </option>
            ))}
          </select>
        </div>

        {/* Seat Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Seat
          </label>
          <select
            value={seatId}
            onChange={(e) => setSeatId(e.target.value)}
            className="w-full border p-3 rounded"
          >
            <option value="">-- Choose Seat --</option>
            {seats.map((s) => (
              <option key={s._id} value={s._id}>
                {s.seatNumber} - {s.location || "No location"}
              </option>
            ))}
          </select>
        </div>

        {/* Date Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Date
          </label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-3 rounded"
          />
        </div>
      </div>

      <button
        onClick={assignSeat}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow disabled:opacity-50"
      >
        {loading ? "Assigning..." : "Assign Seat"}
      </button>
    </div>
  );
}
