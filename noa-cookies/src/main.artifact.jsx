// Entrada de la versión para artefacto: sin fuentes empaquetadas (se piden a
// Google Fonts) ni scroll suave. Ver vite.artifact.config.js y artifact/assemble.mjs.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import './brand/theme.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
