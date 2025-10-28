import './App.css'
import Login from './login/Login.jsx'
import { Toaster } from 'sonner';
import { Route, Routes } from 'react-router-dom';
import Register from './register/Register.jsx';
import { Home } from './home/Home.jsx';
import { AuthContextProvider } from './context/AuthContext';
import { VerifyUsers } from './utils/VerifyUsers.jsx';
import Profile from './home/components/Profile.jsx';
function App() {
  return (
    <>
      <div className='p-2 w-screen h-screen flex items-center justify-center'>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route element={<VerifyUsers />}>
            <Route path='/' element={<Home />} />
            <Route path='/profile' element={<Profile />} />
          </Route>
        </Routes>
        <Toaster />
      </div>
    </>
  )
}

export default App
