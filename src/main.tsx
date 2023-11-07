import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";
import { AuthContextProvider } from "./providers/AuthProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
