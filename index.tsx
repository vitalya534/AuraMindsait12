
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  const err = document.createElement('div');
  err.innerHTML = '<div style="color: white; padding: 20px; font-family: sans-serif;">Critical Error: Root element #root not found.</div>';
  document.body.appendChild(err);
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Mounting error:", error);
    rootElement.innerHTML = `<div style="color: white; padding: 20px;">Render Error: ${error instanceof Error ? error.message : String(error)}</div>`;
  }
}
