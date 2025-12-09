import React, { useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const Login = () => {
    const navigate = useNavigate()
    const { setAuthUser } = useAuth();
    const [ userInput, setUserInput ] = useState({});
    const [ loading, setLoading ] = useState(false);

    const handleInput = (e) => {
        setUserInput({
            ...userInput, [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const login = await axios.post('/api/auth/login', userInput);
            const data = login.data;
            if (data.success === false) {
                setLoading(false);
                toast.error("Invalid login credentials");
                return;
            }
            toast.success(data.message);
            localStorage.setItem('chatrix', JSON.stringify(data));
            setAuthUser(data);
            setLoading(false);
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center mix-w-full mx-auto">
            <div className="w-full p-6 rounded-lg shadow-lg bg-gray-900 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
                <h1 className="text-blue-300 text-center font-bold text-3xl">Login <span className="text-green-600">Chatrix</span></h1>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="flex mt-2 gap-4">
                        <input onChange={handleInput} type="email" id="email" placeholder="Enter email" required className='w-full input h-10 focus:outline-none focus:ring focus:border-blue-600' />
                    </div>
                    <div className="flex mt-2 gap-4">
                        <input onChange={handleInput} type="password" id="password" placeholder="Enter password" required className='w-full input h-10 focus:outline-none focus:ring focus:border-blue-600' />
                    </div>
                    <button
                        type="submit"
                        className='mt-4 self-center 
                            w-auto px-2 py-1 font-bold bg-blue-400 
                            text-lg hover:bg-blue-300 
                            text-white rounded-lg scale-105'
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
                <div className='pt-2'>
                    <p className='text-sm font-semibold
                         text-blue-300'>
                        Don't have an Acount ? <Link to={'/register'}>
                            <span
                                className='text-gray-700 
                            font-bold underline cursor-pointer
                             hover:text-green-700'>
                                Register Now!!
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login