import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import WhatsApp from './pages/WhatsApp'
import BulkMessage from './pages/BulkMessage'
import GetAllForms from './pages/GetAllForms'
import Home from './pages/Home'
import Chat from './pages/Chat'

function App() {  
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/whatsapp" element={<WhatsApp />} />
        <Route path="/bulk-message" element={<BulkMessage />} />
        <Route path="/forms/*" element={<GetAllForms />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
  )
}

export default App