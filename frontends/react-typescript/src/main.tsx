import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppProviders } from './app/providers/AppProviders'
import App from './App'
import './styles/globals.css'

/**
 * Application entry point
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
)
