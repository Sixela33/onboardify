import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import WhatsApp from './pages/WhatsApp'
import BulkMessage from './pages/BulkMessage'
import CreateForm from './pages/CreateForm'

function App() {  
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/whatsapp" replace />} />
        <Route path="/whatsapp" element={<WhatsApp />} />
        <Route path="/bulk-message" element={<BulkMessage />} />
        <Route path="/create-form" element={<CreateForm />} />
      </Routes>
  )
}

export default App