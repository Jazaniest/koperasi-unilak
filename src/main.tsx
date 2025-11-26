import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import KoperasiPage from '@/pages/KoperasiPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KoperasiPage />
  </StrictMode>,
)
