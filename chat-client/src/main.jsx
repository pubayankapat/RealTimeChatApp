import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthContextProvider } from './context/AuthContext'
import { BrowserRouter } from 'react-router-dom';
import { SocketContextProvider } from './context/socketContext.jsx'

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <AuthContextProvider>
      <SocketContextProvider>
      <App />
      </SocketContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
)
