import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Create root with the modern React 18 API
const root = createRoot(document.getElementById('root'));

// Render the app inside StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

