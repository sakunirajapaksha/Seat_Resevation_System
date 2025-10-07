import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

document.title = "Seat Reservation System"; // ✅ Page Title

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
