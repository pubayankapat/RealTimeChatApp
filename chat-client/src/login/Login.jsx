import React, { useState } from "react";
import { Link } from 'react-router-dom';


const Login = () => {
const [userInput , setUserInput] = useState({
   
});


const handleInput = () => {
    
}

const handleSubmit = () => {
    
}
    return (
        <div className="flex flex-col items-center justify-center mix-w-full mx-auto">
            <div className="w-full p-6 rounded-lg shadow-lg bg-gray-900 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
                <h1 className="text-blue-300 text-center font-bold text-3xl">Login <span className="text-green-600">Chatrix</span></h1>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div>
                        <label className="font-bold text-blue-400 text-xl label-text">Email:</label>
                        <input onChange={handleInput} type="email" id="email" placeholder="Enter your email" required className='w-full input h-10 focus:outline-none focus:ring focus:border-blue-600' />
                    </div>
                    <div>
                        <label className="font-bold text-blue-400 text-xl label-text">Password:</label>
                        <input onChange={handleInput} type="password" id="password" placeholder="Enter your password" required className='w-full input h-10 focus:outline-none focus:ring focus:border-blue-600' />
                    </div>
                    <button type="submit" className='mt-4 self-center 
                            w-auto px-2 py-1 font-bold bg-blue-400 
                            text-lg hover:bg-blue-300 
                            text-white rounded-lg scale-105'>LogIn</button>
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