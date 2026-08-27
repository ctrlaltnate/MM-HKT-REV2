import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { App } from "./App";
import { AppProvider } from "./context/AppContext";
import { OperationsProvider } from "./context/OperationsContext";
import { ToastProvider } from "./context/ToastContext";
import "./styles.css";

const root = document.getElementById("root");

if (!root) throw new Error("Missing #root element");

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <OperationsProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </OperationsProvider>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
);
