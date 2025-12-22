import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AgencyProvider } from "./context/AgencyContext.jsx"; // [NEW IMPORT]

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* AgencyProvider sabse bahar hona chahiye taaki Auth aur App ko agency ka pata rahe */}
    <AgencyProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AgencyProvider>
  </React.StrictMode>
);
