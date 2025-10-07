import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function AdminEditSeats() {
  const [seats, setSeats] = useState([]);
  const [editingSeat, setEditingSeat] = useState(null);
  const [form, setForm] = useState({ seatNumber: "", location: "", amenities: "" });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  // ✅ Stable loadSeats using useCallback
  const loadSeats = useCallback(async () => {
    try {
      const { data } = await API.get("/seats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSeats(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load seats");
    }
  }, [token]);

  useEffect(() => {
    loadSeats(); // ✅ safe to include
  }, [loadSeats]);

  function startEditing(seat) {
    setEditingSeat(seat);
    setForm({
      seatNumber: seat.seatNumber,
      location: seat.location,
      amenities: seat.amenities?.join(", ") || "",
    });
  }

  function cancelEdit() {
    setEditingSeat(null);
    setForm({ seatNumber: "", location: "", amenities: "" });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await API.put(
        `/seats/${editingSeat._id}`,
        {
          seatNumber: form.seatNumber,
          location: form.location,
          amenities: form.amenities
            ? form.amenities.split(",").map((a) => a.trim())
            : [],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Seat updated successfully");
      cancelEdit();
      loadSeats();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, seatNumber) {
    if (!window.confirm(`Delete seat ${seatNumber}?`)) return;
    try {
      setDeleting(id);
      await API.delete(`/seats/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`Seat ${seatNumber} deleted successfully`);
      setSeats((prev) => prev.filter((s) => s._id !== id));
      if (editingSeat?._id === id) cancelEdit();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-lg">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Seats</h1>
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>

      {/* Seats Table */}
      <table className="min-w-full border border-gray-300 text-left mb-8">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">Seat #</th>
            <th className="p-3 border">Location</th>
            <th className="p-3 border">Amenities</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {seats.map((s) => (
            <tr key={s._id} className="hover:bg-gray-50">
              <td className="p-3 border">{s.seatNumber}</td>
              <td className="p-3 border">{s.location}</td>
              <td className="p-3 border">{s.amenities?.join(", ") || "—"}</td>
              <td className="p-3 border space-x-2">
                <button
                  onClick={() => startEditing(s)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s._id, s.seatNumber)}
                  disabled={deleting === s._id}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded disabled:opacity-50"
                >
                  {deleting === s._id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Form */}
      {editingSeat && (
        <div className="p-6 bg-gray-50 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Edit Seat {editingSeat.seatNumber}
          </h2>
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="text"
              placeholder="Seat Number"
              value={form.seatNumber}
              onChange={(e) => setForm({ ...form, seatNumber: e.target.value })}
              className="border p-3 w-full rounded"
            />
            <input
              type="text"
              placeholder="Location/Area"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="border p-3 w-full rounded"
            />
            <input
              type="text"
              placeholder="Amenities (comma separated)"
              value={form.amenities}
              onChange={(e) => setForm({ ...form, amenities: e.target.value })}
              className="border p-3 w-full rounded"
            />

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              >
                {loading ? "Updating..." : "Update Seat"}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
