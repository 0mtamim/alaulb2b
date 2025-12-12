
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Critical Error during App Mount:", error);
  rootElement.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;text-align:center;font-family:sans-serif;color:#ef4444;">
      <h1>Application Error</h1>
      <p>Failed to initialize the application.</p>
      <pre style="background:#fef2f2;padding:1rem;border-radius:0.5rem;color:#991b1b;font-size:0.8rem;max-width:80vw;overflow:auto;">${error instanceof Error ? error.message : String(error)}</pre>
    </div>
  `;
}
