import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Providers from './Providers.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import CustomSidebar from './components/CustomSidebar.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <BrowserRouter>
        <CustomSidebar/>
        <App />
        <Toaster />
      </BrowserRouter>
    </Providers>
  </StrictMode>,
)
