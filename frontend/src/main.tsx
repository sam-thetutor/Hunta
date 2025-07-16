import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Polyfills for Stellar Wallets Kit
import { Buffer } from 'buffer'

// Extend Window interface
declare global {
  interface Window {
    Buffer: typeof Buffer;
    global: typeof globalThis;
  }
}

// Make Buffer available globally
window.Buffer = Buffer

// Make global available
if (typeof (globalThis as any).global === 'undefined') {
  window.global = window
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 