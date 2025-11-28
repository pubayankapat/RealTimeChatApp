import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthContextProvider } from './context/AuthContext'
import { BrowserRouter } from 'react-router-dom';
import { SocketContextProvider } from './context/SocketContext'
import axios from 'axios';

// Always send cookies (JWT) with requests
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <AuthContextProvider>
      <SocketContextProvider>
      <App />
      </SocketContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
)
