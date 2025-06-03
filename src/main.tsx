import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginPage from './pages/Login.tsx'
import Atencion from './pages/Atencion.tsx'
import App from './App.tsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
   <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/principal" element={<App />} />
        <Route path="/atencion" element={<Atencion />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
