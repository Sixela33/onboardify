import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import WhatsApp from './pages/WhatsApp'
import BulkMessage from './pages/BulkMessage'
import GetAllForms from './pages/GetAllForms'
import Home from './pages/Home'
import Chats from './pages/Chats'
import FormStatuese from './pages/FormStatuese'
import CreateForm from './pages/CreateForm'
import Auth from './pages/Auth'
import ProtectedRoute from './components/ProtectedRoute'

function App() {  
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route element={<ProtectedRoute/>}>
        <Route path="/home" element={<Home />} />
        <Route path="/whatsapp" element={<WhatsApp />} />
        <Route path="/bulk-message" element={<BulkMessage />} />
        <Route path="/create-form" element={<CreateForm />} />
        <Route path="/forms" element={<GetAllForms />} />
        <Route path="/form-status" element={<FormStatuese />} />
        <Route path="/chat" element={<Chats />} />
      </Route>
    </Routes>
  )
}

export default App