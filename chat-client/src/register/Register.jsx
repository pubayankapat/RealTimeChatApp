import axios from "axios";
import React, { useState } from "react"
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const Register = () => {
    const navigate = useNavigate();
    const [inputData, setInputData] = useState({})
    const [loading, setLoading] = useState(false);

    const handleInput = (e) => {
        setInputData({
            ...inputData, [e.target.id]: e.target.value
        })
        console.log(inputData);

    }

    const selectGender = (selectGender) => {
        setInputData((prev) => ({
            ...prev, gender: selectGender === inputData.gender ? '' : selectGender
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (inputData.password.toLowerCase() !== inputData.confpassword.toLowerCase()) {
            setLoading(false)
            return toast.error("Password doesn't matched")
        }
        try {
            const register = await axios.post('/api/auth/register', inputData);
            const data = register.data;
            if (data === false) {
                setLoading(false);
                toast.error("Invalid login credentials");
                return;
            }

            toast.success(data.message);
            setLoading(false)
            navigate('/login');

        } catch (error) {
            setLoading(false)
            console.log(error);
            toast.error(error?.response?.data?.message)
        }
    }
    return (
        <div className="flex flex-col items-center justify-center mix-w-full mx-auto">
            <div className="w-full p-6 rounded-lg shadow-lg bg-gray-900 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
                <h1 className="text-blue-300 text-center font-bold text-3xl">Register<span className="text-green-600">Chatrix</span></h1>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div>
                        <label className="font-bold text-blue-400 text-xl label-text">Fullname:</label>
                        <input onChange={handleInput} type="text" id="fullname" placeholder="Enter your fullname" required className='w-full input h-10 focus:outline-none focus:ring focus:border-blue-600' />
                    </div>
                    <div>
                        <label className="font-bold text-blue-400 text-xl label-text">Username:</label>
                        <input onChange={handleInput} type="text" id="username" placeholder="Enter your Username" required className='w-full input h-10 focus:outline-none focus:ring focus:border-blue-600' />
                    </div>
                    <div>
                        <label className="font-bold text-blue-400 text-xl label-text">Email:</label>
                        <input onChange={handleInput} type="email" id="email" placeholder="Enter your email" required className='w-full input h-10 focus:outline-none focus:ring focus:border-blue-600' />
                    </div>
                    <div>
                        <label className="font-bold text-blue-400 text-xl label-text">Password:</label>
                        <input onChange={handleInput} type="password" id="password" placeholder="Enter your password" required className='w-full input h-10 focus:outline-none focus:ring focus:border-blue-600' />
                    </div>
                    <div>
                        <label className="font-bold text-blue-400 text-xl label-text">Confirm Password:</label>
                        <input onChange={handleInput} type="password" id="confpassword" placeholder="Enter your password" required className='w-full input h-10 focus:outline-none focus:ring focus:border-blue-600' />
                    </div>
                    <div id="gender" className="flex mt-2 gap-4">
                        <label className="cursor-pointer label flex">
                            <span className="label-text font-semibold text-shadow-white">Male</span>
                            <input onChange={() => selectGender('male')}
                                checked={inputData.gender === 'male'} type="checkbox" className="checkbox checkbox-info" />
                            <span className="label-text font-semibold text-shadow-white">Female</span>
                            <input onChange={() => selectGender('female')}
                                checked={inputData.gender === 'female'} type="checkbox" className="checkbox checkbox-info" />
                        </label>
                    </div>
                    <button
                        type="submit"
                        className='mt-4 self-center 
                            w-auto px-2 py-1 font-bold bg-blue-400 
                            text-lg hover:bg-blue-300 
                            text-white rounded-lg scale-105'
                        disabled={loading}
                    >
                        {loading ? "Registering......" : "Register"}
                    </button>
                </form>
                <div className='pt-2'>
                    <p className='text-sm font-semibold
                         text-blue-300'>
                        Have an Acount ? <Link to={'/login'}>
                            <span
                                className='text-gray-700 
                            font-bold underline cursor-pointer
                             hover:text-green-700'>
                                Login Now!!
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
export default Register