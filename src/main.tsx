import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './global.css'
import App from './App.js'

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <BrowserRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </BrowserRouter>
  )
} 