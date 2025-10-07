import React from "react";

export default function SeatSquare({
  seat,
  isMine,
  isBooked,
  myReservation,
  onBook,
  onCancel,
  booking,
  cancelling
}) {
  const baseClasses = "w-24 h-24 border-2 rounded-xl flex flex-col justify-center items-center cursor-pointer text-center transition-all duration-200 ease-in-out transform";
  
  const statusClasses = isMine
    ? "bg-gradient-to-br from-green-400 to-green-600 text-white border-green-600 shadow-lg scale-105"
    : isBooked
    ? "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-600 border-gray-400 cursor-not-allowed"
    : "bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300 hover:from-blue-200 hover:to-blue-300 hover:shadow-md hover:scale-102";

  const buttonBaseClasses = "text-xs w-full rounded-lg p-1.5 font-medium transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";

  return (
    <div className={`${baseClasses} ${statusClasses}`}>
      {/* Seat Number with better styling */}
      <div className="flex flex-col items-center mb-1">
        <span className="font-bold text-lg tracking-tight">#{seat.seatNumber}</span>
        <span className="text-[10px] opacity-70 font-mono">ID:{seat._id.slice(-4)}</span>
      </div>

      {/* Action Button Area */}
      <div className="mt-1 w-full px-2">
        {isMine ? (
          <button
            onClick={() => onCancel(myReservation._id)}
            disabled={cancelling === myReservation._id}
            className={`${buttonBaseClasses} bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white active:scale-95`}
          >
            {cancelling === myReservation._id ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cancelling
              </span>
            ) : "Cancel"}
          </button>
        ) : !isBooked ? (
          <button
            onClick={() => onBook(seat._id, seat.seatNumber)}
            disabled={booking === seat._id}
            className={`${buttonBaseClasses} bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white active:scale-95`}
          >
            {booking === seat._id ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Booking
              </span>
            ) : "Book Now"}
          </button>
        ) : (
          <div className="bg-gray-500 text-white text-[11px] rounded-lg py-1.5 px-2 font-medium opacity-90">
            Reserved
          </div>
        )}
      </div>
    </div>
  );
}