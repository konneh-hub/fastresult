import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";

// Load and apply saved theme on app startup (per-user if available)
const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
const savedTheme = localStorage.getItem(`userThemeKey_${currentUser.id}`) || 'light';
const themeColors: any = {
  light: {
    backgroundColor: '#ffffff',
    sidebarBg: '#f5f7fa',
    textColor: '#333333',
  },
  dark: {
    backgroundColor: '#1a1a1a',
    sidebarBg: '#0d0d0d',
    textColor: '#ffffff',
  },
  blue: {
    backgroundColor: '#e3f2fd',
    sidebarBg: '#1e3c72',
    textColor: '#0d47a1',
  },
  green: {
    backgroundColor: '#e8f5e9',
    sidebarBg: '#1b5e20',
    textColor: '#1b5e20',
  },
  purple: {
    backgroundColor: '#f3e5f5',
    sidebarBg: '#4a148c',
    textColor: '#6a1b9a',
  },
  orange: {
    backgroundColor: '#fff3e0',
    sidebarBg: '#e65100',
    textColor: '#e65100',
  },
};

const theme = themeColors[savedTheme] || themeColors.light;
const root = document.documentElement;
root.style.setProperty('--bg-color', theme.backgroundColor);
root.style.setProperty('--sidebar-bg', theme.sidebarBg);
root.style.setProperty('--text-color', theme.textColor);
root.style.setProperty('--theme', savedTheme);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
