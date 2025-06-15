import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import WhatsApp from './pages/WhatsApp'
import BulkMessage from './pages/BulkMessage'
import CreateForm from './pages/CreateForm'
import GetAllForms from './pages/GetAllForms'
import FormStatuese from './pages/FormStatuese'

function App() {  
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/whatsapp" replace />} />
        <Route path="/whatsapp" element={<WhatsApp />} />
        <Route path="/bulk-message" element={<BulkMessage />} />
        <Route path="/create-form" element={<CreateForm />} />
        <Route path="/forms" element={<GetAllForms />} />
        <Route path="/form-status" element={<FormStatuese />} />
      </Routes>
  )
}

export default App