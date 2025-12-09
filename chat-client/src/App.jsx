import './App.css'
import Login from './login/Login.jsx'
import { Toaster, toast } from 'sonner';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Register from './register/Register.jsx';
import { Home } from './home/Home.jsx';
import { VerifyUsers } from './utils/VerifyUsers.jsx';
import Profile from './home/components/Profile.jsx';
import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './context/AuthContext';


function App() {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();

  // On app load, verify that the server still sees a valid JWT cookie.
  // If not, clear localStorage and send the user to the login page.
  useEffect(() => {
    const checkSession = async () => {
      // If there's no client auth state, nothing to validate
      if (!authUser) return;

      try {
        // Any endpoint protected by isLogin will work as a cookie check
        await axios.get('/api/user/currentchatters');
      } catch (error) {
        // If the JWT cookie is missing/invalid, the request will fail
        localStorage.removeItem('chatrix');
        setAuthUser(null);
        navigate('/login', { replace: true });
        console.log(error);
        toast.error("Session expired please log in again..")
        
      }
    };

    checkSession();
  }, [authUser, navigate, setAuthUser]);

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
