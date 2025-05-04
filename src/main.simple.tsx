import React from 'react';
import ReactDOM from 'react-dom/client';
import SimpleApp from './App.simple';
import './index.css';

// Simple console log to verify JavaScript is executing
console.log('Main entry point loaded successfully');

// Create root and render basic app
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <SimpleApp />
    </React.StrictMode>
  );
} else {
  console.error('Failed to find root element - check your HTML');
}
