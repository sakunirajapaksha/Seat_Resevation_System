import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    navigate("/admin-login");
  }

  const actionCards = [
    {
      title: "Add New Seat",
      description: "Create new seating arrangements",
      icon: "➕",
      path: "/admin-add-seat",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Manage Seats",
      description: "Edit existing seat configurations",
      icon: "✏️",
      path: "/admin-edit-seats",
      color: "bg-indigo-500 hover:bg-indigo-600"
    },
    {
      title: "Reservations by Date",
      description: "View bookings for specific dates",
      icon: "📅",
      path: "/admin-reservations",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Reservations by Intern",
      description: "Check intern booking history",
      icon: "👤",
      path: "/admin-reservations-intern",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Manual Assign",
      description: "Manually assign seats to interns",
      icon: "➕",
      path: "/admin-manual-assign",
      color: "bg-orange-500 hover:bg-orange-600"
    },
    {
      title: "Usage Reports",
      description: "Generate seat utilization analytics",
      icon: "📊",
      path: "/admin-reports",
      color: "bg-teal-500 hover:bg-teal-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Welcome back, <span className="font-semibold text-blue-600">
                  {localStorage.getItem("adminEmail")}
                </span>
              </p>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <span>🚪</span>
              Logout
            </button>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actionCards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              className={`${card.color} text-white p-6 rounded-xl shadow-sm cursor-pointer transform transition-transform duration-200 hover:scale-105 group`}
            >
              <div className="flex items-center gap-4 mb-3">
                <span className="text-2xl">{card.icon}</span>
                <h3 className="text-xl font-semibold">{card.title}</h3>
              </div>
              <p className="text-blue-100 opacity-90">{card.description}</p>
              <div className="mt-4 flex justify-end">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm group-hover:bg-opacity-30 transition-all">
                  Access →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats (Optional - you can add actual stats later) */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Seats</p>
              <p className="text-2xl font-bold text-blue-900">--</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Active Reservations</p>
              <p className="text-2xl font-bold text-green-900">--</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Available Today</p>
              <p className="text-2xl font-bold text-purple-900">--</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}